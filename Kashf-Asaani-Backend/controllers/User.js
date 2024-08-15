const {
  User,
  validation,
  authValidation,
  updateProfileScheme,
} = require('../models/User')
const bcrypt = require('bcrypt')
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const db = require("../config/db.js");
const moment = require('moment');
const { format } = require("date-fns");

exports.createUser = async (req, res) => {
  try {
    const { cnic } = req.body;
    const sql = `SELECT * FROM client WHERE CNIC= :cnic`;

    // Execute the SQL statement
    const connection = await db.getConnection();
    const result = await connection.execute(sql, { cnic });

    if (result.rows.length == 0) {
      return res.status(400).send({ error: 'Invalid CNIC' });
    }
    if (result.rows[0].ACTIVE_FLAG == 1) {
      return res.status(400).send({ error: 'Your account is already active' })
    }
    else {
      const sql2 = `UPDATE CLIENT SET ACTIVE_FLAG = 1 WHERE CNIC = :cnic`;
      await connection.execute(sql2, { cnic }, { autoCommit: true });
    }

    const token = jwt.sign({ cnic }, 'secret-key', { expiresIn: '1h' });

    // const token = createdUser.genAuthToken()

    return res.status(201).send({
      token,
      message: 'Account Created Successfully',
    })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

exports.loginUser = async (req, res) => {
  try {

    const { cnic } = req.body;
    const sql = `SELECT * from client WHERE cnic=` + cnic;

    // Execute the SQL statement
    const connection = await db.getConnection();
    const result = await connection.execute(sql);

    if (result.rows.length == 0) {
      return res.status(400).send({ error: 'Invalid CNIC' });
    }
    if (result.rows[0].ACTIVE_FLAG == 0) {
      return res.status(400).send({ error: 'Your account has not been activated yet' })
    }

    const token = jwt.sign({ cnic }, 'secret-key', { expiresIn: '1h' });
    return res.status(201).send({ token, message: 'success' });

    // const token = createdUser.genAuthToken()
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

exports.sendCode = async (req, res) => {
  try {
    const cnic = req.body.cnic
    const sql = `SELECT * from client WHERE cnic=` + cnic;

    // Execute the SQL statement
    const connection = await db.getConnection();
    const result = await connection.execute(sql);

    if (result.rows.length == 0) {
      return res.status(400).send({ error: 'Invalid CNIC' });
    }

    if (result.rows[0].ACTIVE_FLAG == 0) {
      return res.status(400).send({ error: 'Your account is not activated yet' })
    }

    cell = result.rows[0].CELL
    cell = '0' + cell
    return res.status(201).send({ cell });

  } catch (error) {
    console.error('Error in Login:', error.message);
    return res.status(500).send({ error: 'Internal Server Error' });
  }

};

exports.sendCodeWhenSignup = async (req, res) => {
  try {
    const cnic = req.body.cnic
    const sql = `SELECT * from client WHERE cnic=` + cnic;

    // Execute the SQL statement
    const connection = await db.getConnection();
    const result = await connection.execute(sql);

    if (result.rows.length == 0) {
      return res.status(400).send({ error: 'Invalid CNIC' });
    }

    if (result.rows[0].ACTIVE_FLAG == 1) {
      return res.status(400).send({ error: 'Your account is already active' })
    }

    cell = result.rows[0].CELL
    cell = '0' + cell
    return res.status(201).send({ cell });

  } catch (error) {
    console.error('Error in sendCodeWhenSignup:', error.message);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.loanRequest = async (req, res) => {

  try {

    const token = req.headers.authorization;
    const { cnic } = req.body;

    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
        // Attach the user information to the request object for further processing
        req.user = user;
    });

    const { amount } = req.body;

    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;
    const currentDate = new Date()

    const bindVars = {
      clientId: { val: clientId, type: oracledb.NUMBER },
      currentDate: { val: currentDate, type: oracledb.DATE },
      amount: { val: amount, type: oracledb.NUMBER },
      status: { val: "pending", type: oracledb.STRING }
    };

    const sql2 = `INSERT INTO LOAN_REQUEST (CLIENT_ID, DATE_, AMT_REQUESTED, STATUS) 
      VALUES (:clientId, :currentDate, :amount, :status)`;
    const result2 = await connection.execute(sql2, bindVars, { autoCommit: true });

    if (result2.rowsAffected === 1) {
      return res.status(201).send({ message: 'success' });
    } else {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
}

exports.cancelLoanRequest = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { cnic } = req.body;

    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Attach the user information to the request object for further processing
       req.user = user;
    });

    const { loanReq } = req.body;

    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;
    const currentDate = loanReq.date;
    const amount = loanReq.amountRequested;


    const sql2 = `DELETE FROM LOAN_REQUEST WHERE AMT_REQUESTED = :amount AND CLIENT_ID = :clientId AND DATE_ LIKE :currentDate`;
    const bindVars = {
      clientId: { val: clientId, type: oracledb.NUMBER },
      currentDate: { val: currentDate, type: oracledb.STRING },
      amount: { val: amount, type: oracledb.NUMBER }
    };

    const result2 = await connection.execute(sql2, bindVars, { autoCommit: true });
    if (result2.rowsAffected > 0) {
      return res.status(201).send({ message: 'success' });
    } else {
      return res.status(500).send('No rows were deleted');
    }

  } catch (error) {
    console.log("exception", error)
    return res.status(500).send(error);
  }
}

exports.submitComplaint = async (req, res) => {
  try {

    const token = req.headers.authorization;
    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Attach the user information to the request object for further processing
     req.user = user;
    });

    const { cnic } = req.body;
    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;
    console.log('Client ID:', clientId);

    const { option, text, recording } = req.body;
    const currentDate = new Date();
    const dateInUrdu = currentDate

    const bindVars = {
      selectedOption: { val: option, type: oracledb.STRING },
      clientId: { val: clientId, type: oracledb.NUMBER },
      dateInUrdu: { val: dateInUrdu, type: oracledb.DATE },
      status: { val: "Pending", type: oracledb.STRING },
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const sql2 = `INSERT INTO COMPLAINT (COMPLAINT_TYPE, CLIENT_ID, DATE_, STATUS) 
    VALUES (:selectedOption, :clientId, :dateInUrdu, :status) RETURNING ID INTO :id`;
    const result2 = await connection.execute(sql2, bindVars, { autoCommit: true });

    const generatedId = result2.outBinds.id[0];

    if (option == 'کوئی اور شکایت') {
      const sql3 = `INSERT INTO OTHER_COMPLAINT (COMPLAINT_ID, TEXT_CONTENT, AUDIO_CONTENT) 
      VALUES (:generatedId, :text, :recording)`;
      const bindVars2 = {
        generatedId: { val: generatedId, type: oracledb.NUMBER },
        text: { val: text, type: oracledb.STRING },
        recording: { val: recording, type: oracledb.BLOB } // Assuming the recording is a BLOB
      };

      const result3 = await connection.execute(sql3, bindVars2, { autoCommit: true });
      if (result3.rowsAffected === 1) {
        return res.status(201).send({ message: 'success' });
      } else {
        return res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
}


exports.currentLoanDetails = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const cnic = req.body.cnic;
    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Attach the user information to the request object for further processing
      req.user = user;
    }); 

    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;

    const loanQuery = `
      SELECT l.id, i.INSTALLMENT_NUM, i.STATUS, i.DUE_DATE, i.RECEIVED_AMT
      FROM LOAN l join LOAN_INSTALLMENT i on l.id = LOAN_INSTALLMENT.LOAN_ID
      WHERE l.CLIENT_ID = :clientId AND l.ACTIVE_FLAG = 1
    `;

    const loanBindParams = { clientId: { val: clientId, type: oracledb.NUMBER } };

    const loanResult = await connection.execute(loanQuery, loanBindParams);

    // Helper function to format date as "DD Month YYYY"
    const formatDateWithoutTime = (date) => {
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options); // Use 'en-US' to format as "05 June 2024"
    };

    // Construct the data array from the result
    const data = loanResult.rows.map(row => ({
      status: row.STATUS,
      date: formatDateWithoutTime(row.DUE_DATE),
      type: row.RECEIVED_AMT,
      number: row.INSTALLMENT_NUM
    }));

    const iQuery = `
      WITH LatestPassedInstallment AS (
        SELECT i.* FROM LOAN_INSTALLMENT JOIN LOAN l ON l.id = i.LOAN_ID 
        WHERE l.CLIENT_ID = :clientId AND l.ACTIVE_FLAG = 1 AND i.DUE_DATE < SYSDATE
        ORDER BY i.DUE_DATE DESC
        FETCH FIRST 1 ROWS ONLY
      ), AllInstallments AS (
        SELECT i.* FROM LOAN_INSTALLMENT i
        JOIN LOAN l ON l.id = LOAN_INSTALLMENT.LOAN_ID
        WHERE l.CLIENT_ID = :clientId
          AND l.ACTIVE_FLAG = 1
      )
      SELECT
        a.INSTALLMENT_NUM,
        a.STATUS,
        a.DUE_DATE,
        a.RECEIVED_AMT,
        (SELECT SUM(DUE_AMOUNT) FROM AllInstallments) AS TOTAL_AMOUNT_DUE,
        (SELECT RECEIVED_AMT FROM LatestPassedInstallment) AS PREVIOUS_INSTALLMENT_AMOUNT_DUE
      FROM AllInstallments a
    `;
    const iBindParams = { clientId: { val: clientId, type: oracledb.NUMBER } };

    const iResult = await connection.execute(iQuery, iBindParams);


    const currentInstallment = iResult.rows[0];
    const totalAmountDue = currentInstallment.TOTAL_AMOUNT_DUE;
    const previousInstallmentAmountDue = currentInstallment.PREVIOUS_INSTALLMENT_AMOUNT_DUE;

    // Construct the data array from the result
    const installmentDetails = iResult.rows.map(row => ({
      totalAmountDue: totalAmountDue,
      currentInstallmentAmountDue: currentInstallment.DUE_AMOUNT,
      installmentNumber: currentInstallment.INSTALLMENT_NUM,
      dueDate: formatDateWithoutTime(currentInstallment.DUE_DATE),
      previousInstallmentAmountDue: previousInstallmentAmountDue,
    }));

    // Send the response after verifying the token and constructing the data array
    return res.status(201).send({ loandetails: data, installmentDetails: installmentDetails, message: 'success' });
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
};

exports.loanHistory = async (req, res) => {

  try {
    const token = req.headers.authorization;
    const cnic = req.body.cnic;

    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Attach the user information to the request object for further processing
      req.user = user;
    });


    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;

    const loanQuery = `
        SELECT id, LOAN_STATUS, LOAN_TYPE
        FROM LOAN
        WHERE CLIENT_ID = :clientId
      `;
    const loanBindParams = { clientId: { val: clientId, type: oracledb.NUMBER } };

    const loanResult = await connection.execute(loanQuery, loanBindParams);

    // Construct the data array from the result
    const data = loanResult.rows.map(row => ({
      number: row.ID,
      status: row.LOAN_STATUS,
      type: row.LOAN_TYPE
    }));

    return res.status(201).send({ history: data, message: 'success' });

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
}

exports.complaintsHistory = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const cnic = req.body.cnic;
    
    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Attach the user information to the request object for further processing
       req.user = user;
    });

    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;

    const Query = `
      SELECT STATUS, DATE_, COMPLAINT_TYPE, id
      FROM COMPLAINT
      WHERE CLIENT_ID = :clientId
    `;
    const complaintBindParams = { clientId: { val: clientId, type: oracledb.NUMBER } };

    const complaintResult = await connection.execute(Query, complaintBindParams);

    // Construct the data array from the result
    const data = complaintResult.rows.map(row => ({
      status: row.STATUS,
      date: row.DATE_,
      type: row.COMPLAINT_TYPE,
      number: row.ID
    }));

    return res.status(201).send({ history: data, message: 'success' });
    
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
}

exports.loanRequestHistory = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const cnic = req.body.cnic;

    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
    });

    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;

    const Query = `
      SELECT STATUS, DATE_, AMT_REQUESTED, id
      FROM LOAN_REQUEST
      WHERE CLIENT_ID = :clientId
    `;
    const loanBindParams = { clientId: { val: clientId, type: oracledb.NUMBER } };
    const loanResult = await connection.execute(Query, loanBindParams);

    // Helper function to format date as "DD Month YYYY"
    const formatDateWithoutTime = (date) => {
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options); // Use 'en-US' to format as "05 June 2024"
    };

    // Construct the data array from the result
    const data = loanResult.rows.map(row => ({
      status: row.STATUS,
      date: formatDateWithoutTime(row.DATE_),
      amount: row.AMT_REQUESTED,
      purpose: "purpose",
      number: row.ID
    }));

    return res.status(201).send({ history: data, message: 'success' });
    
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
}

exports.existingLoanRequest = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const cnic = req.body.cnic;

    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
    });

    const sql = `SELECT * FROM CLIENT WHERE CNIC = :cnic`;
    const bindParams = { cnic: { val: cnic, type: oracledb.STRING } }; // Explicitly setting type

    // Get a connection from the database
    const connection = await db.getConnection();
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Client not found.' });
    }

    const clientId = result.rows[0].ID;

    const Query = `
      SELECT AMT_REQUESTED, STATUS, DATE_
      FROM LOAN_REQUEST
      WHERE CLIENT_ID = :clientId AND STATUS = 'Pending'
    `;
    const loanBindParams = { clientId: { val: clientId, type: oracledb.NUMBER } };

    const loanResult = await connection.execute(Query, loanBindParams);

    // Construct the data array from the result
    const data = loanResult.rows.map(row => ({
      amount: row.AMT_REQUESTED,
      status: row.STATUS,
      date: row.DATE_,
      purpose: "purpose"
    }));

    return res.status(201).send({ loanRequest: data, message: 'success' });

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
}

exports.changePhoneNumber = async (req, res) => {

  try {
    const token = req.headers.authorization;

    jwt.verify(token.replace('Bearer ', ''), 'secret-key', (err, user) => {
      if (err) {
        // If the token is not valid, return unauthorized status
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
    });

    const { cnic } = req.body;
    const { phone } = req.body;
    const sql = `UPDATE CLIENT SET CELL = :phone WHERE CNIC = :cnic`;

    // Get a connection from the database
    const connection = await db.getConnection();

    // Execute the SQL statement with bind parameters and autoCommit option
    await connection.execute(sql, { phone, cnic }, { autoCommit: true });

  } catch (error) {
    console.error(error);
  }
  return res.status(201).send({ message: 'success' });
}