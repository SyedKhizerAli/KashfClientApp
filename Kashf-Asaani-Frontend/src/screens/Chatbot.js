import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import Navbar from "../components/Navbar";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import { AuthContext } from "../context/AuthContext";
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;
import Groq from "groq-sdk";

const Chatbot = ({ navigation }) => {
  const [sound, setSound] = React.useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [groq, setGroq] = useState(null);

  const { userToken, loggedInCnic } = useContext(AuthContext);

  useEffect(() => {
    const newGroq = new Groq({
        apiKey: "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",
      });
    setGroq(newGroq);
  }, []);


  const sendMessage = async () => {
    const newMessage = {
      role: "user",
      content: inputText,
    };
    setMessages([...messages, newMessage]);
    setInputText("");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            "You are an AI chatbot that represents Kashf Foundation. Clients may ask you questions regarding Kashf Foundation policies. You always have to reply and type in Urdu using Urdu font. Understood?",
        },
        {
          role: "assistant",
          content:
            "بات چीت کررہے ہوں، میرے نام کاشف فاونڈیشن کا AI چیت بョٹ ہے। میرے ساتھ پوچھنا باتیں کشف فاونڈیشن کی سیاسیں سراپرانہ ہیں۔ میں ہمیشہ جواب دوں گا اور ہر بار اردو فونٹ کا استعمال کرکے تاک لکھوں گا۔ سمجھا؟\n\nYes, I understand. I am an AI chatbot representing Kashf Foundation. I am here to answer questions regarding Kashf Foundation's policies. I will always respond and type in Urdu using Urdu font.",
        },
        {
          role: "user",
          content:
            "You are an AI chatbot that represents Kashf Foundation. Clients may ask you questions regarding Kashf Foundation policies. You always have to reply and type in Urdu using Urdu font. Understood?",
        },
        {
          role: "assistant",
          content:
            "ہاں، سمجھا! میں کاشف فاونڈیشن کا AI چیت بٹ ہوں۔ میرے ساتھ پوچھنا باتیں کشف فاونڈیشن کی سیاسیں سراپرانہ ہیں۔ میں ہمیشہ جواب دوں گا اور ہر بار اردو فونٹ کا استعمال کرکے تاک لکھوں گا۔",
        },
        {
          role: "user",
          content:
            "I have some pre made questions for you below in triple quotes:\n'''\nجی سے: کشف فاؤنڈیشن کونسی طرح کے قرضت پرواید کرتی ہے؟\n\nجواب: کشف فاؤنڈیشن مائکرولونز (بڑے ضرر کے قرضت) پرواید کرتی ہے، جن کے ضرر بہت کم ہوتا ہے اور یہ قرض ان لوگوں کو دیے جاتے ہیں جو اپنی خود کمائی والی بزنس کر رہے ہیں।\n\nقسطیوں 2: کشف فاؤنڈیشن کے قرضت کے لیے کیا شرطے ہیں؟\n\nجواب: کشف فاؤنڈیشن کے قرضت کے لیے کچھ عمومی شرطے ہیں، جیسے کہ لوگوں کو اپنی خود کمائی والی بزنس ہونی چاہیے، بزنس کا موقع بہت اچھا ہونا چاہیے، لوگوں کو کشف فاؤنڈیشن کے طرف سے قرض لینے کے لیے پہلے ہی ٹریننگ لینا چاہیے، اور لوگوں کو قرض کا حساب رکھنے کی خبر ہونی چاہیے।\n\nقسطیوں 3: کشف فاؤنڈیشن کے قرضت کا کیا ڈیوریشن ہوتا ہے؟\n\nجواب: کشف فاؤنڈیشن کے قرضت کا ڈیوریشن عمومی طور سے 6 ماه سے 24 ماه تک ہوتا ہے، لیکن یہ لوگوں کی بزنس کے ضرورت اور شکل سے ڈیپینڈ کرتا ہے।\n\nقسطیوں 4: کشف فاؤنڈیشن کے قرضت کے لیے کیا گیرینٹی ہونا چاہیے؟\n\nجواب: کشف فاؤنڈیشن کے قرضت کے لیے گیرینٹی نہیں ہونا چاہیے، لیکن لوگوں کو اپنی بزنس کی خبر ہونی چاہیے اور وہ اپنی بزنس سے قرض کا حساب رکھنے کی خبر بھی ہونی چاہیے।\n\nقسطیوں 5: کشف فاؤنڈیشن کے قرضت کا کیا حساب رکھا جاتا ہے؟\n\nجواب: کشف فاؤنڈیشن کے قرضت کا ہفتہ یا ماہانہ حساب رکھا جاتا ہے، اور لوگوں کو حساب رکھنے کے لیے کشف فاؤنڈیشن کے افیس جا کر حساب رکھا جاتا ہے।\n\nقسطیوں 6: کشف فاؤنڈیشن کے قرضت میں کیا لیٹ فیس ہوتا ہے؟\n\nجواب: کشف فاؤنڈیشن کے قرضت میں لیٹ فیس ہوتا ہے، جس کے ضرر بہت کم ہوتا ہے، لیکن لوگوں کو قرض کا حساب رکھنے کے لیے धیان دینا چاہیے اور قرض کو ٹائم پر حساب رکھنے چاہیے।\n\nقسطیوں 7: کشف فاؤنڈیشن کے قرضت کے لیے کیا ڈاکیومنٹس ہونے چاہیے؟\n\nجواب: کشف فاؤنڈیشن کے قرضت کے لیے کچھ عمومی ڈاکیومنٹس ہونے چاہیے، جیسے کہ لوگوں کا CNIC، بزنس کا رجسٹریشن سرٹیفکیٹ (اگر بزنس رجسٹر ہے تو)، اور بزنس کے کچھ حسابات। لیکن یہ نوٹز کے لیے کہ کشف فاؤنڈیشن کے افیس جا کر پتا لگائیے کہ کیا ڈاکیومنٹس ہونے چاہیے।\n'''\n\nIf a client asks you any of these questions, you have to give the answer as it is given. Okay?\n",
        },
        {
          role: "assistant",
          content:
            "ہاں، سمجھا! میں کاشف فاؤنڈیشن کا AI چیت بٹ ہوں۔ میں پوچھنے والے کو جواب دے سکتا ہوں، جس میں پہلے سے لکھے ہوئے جواب ہے۔",
        },
        {
          role: "user",
          content:
            'Apart from these questions, you dont have to reply. If there is any other prompt you have to reply "معذرت، مجھے اس اطلاعات کو آپ کو فراہم کرنے میں استعمال نہیں ہے۔ براہ کرم ہمارے ہیلپ لائن +92-42-111-981-981 پر سے رابطہ کریں اور اپنی مسئلہ کے بارے میں بات کریں।"\n',
        },
        {
          role: "assistant",
          content:
            "ہاں، سمجھا! میں کاشف فاؤنںدیشن کا AI چیت بٹ ہوں۔ میں پوچھنے والے کو جواب دے سکتا ہوں، جس میں پہلے سے لکھے ہوئے جواب ہے۔ لیکن اگر کوئی دوسرا پوچھنا ہے تو میں معذرت کرتا ہوں کہ میں اس اطلاعات کو آپ کو فرا��م کرنے میں استعمال نہیں ہے۔ براہ کرم ہمارے ہیلپ لائن +92-42-111-981-981 پر سے رابطہ کریں اور اپنی مسئلہ کے بارے میں بات کریں۔",
        },
        newMessage,
      ],
      model: "llama3-8b-8192",
    //   temperature: 0,
    //   max_tokens: 1024,
    //   top_p: 1,
    //   stream: true,
    //   stop: null,
    });
    console.log(chatCompletion)
    console.log(groq)

    for await (const message of chatCompletion) {
        const assistantMessage = {
          role: "assistant",
          content: message.choices[0]?.delta?.content || "",
        };
        setMessages([...messages, assistantMessage]);
      }
  };

  //   useEffect(() => {
  //     // Fetch loan history data from the backend when the component mounts
  //     main();
  //   }, []);

  return (
    <>
      <Navbar navigation={navigation} />
      <View style={styles.container}>
        <View>
          {messages.map((message, index) => (
            <View key={index}>
              <Text>{`${message.role}: `}</Text>
              <Text>{message.content}</Text>
            </View>
          ))}
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF3F0", // Light green background
    padding: 20,
  },
  title: {
    color: "#5DB075",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "right",
    marginLeft: 10,
    marginTop: -15,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  horizontalLine: {
    borderBottomColor: "#5DB075",
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderBottomColor: "#B8C1CC",
    borderBottomWidth: 1,
  },
  headerRow: {
    backgroundColor: "#5DB075", // Header row color
  },
  evenRow: {
    backgroundColor: "#F5F5F5", // Even row color
  },
  oddRow: {
    backgroundColor: "#EFF3F0", // Odd row color
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    color: "white", // Header text color
    fontWeight: "bold",
  },
  headingTwo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  headingThree: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    marginLeft: 10,
    fontSize: 20,
    marginTop: -15,
  },
  headingTextTwo: {
    marginLeft: 10,
    fontSize: 20,
    marginTop: 15,
  },
  greenText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#db3125", //'#5DB075',
    marginLeft: 10,
    textAlign: "center",
  },
  actualgreenText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#5DB075",
    marginLeft: 10,
    textAlign: "center",
  },
  smolGreenText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5DB075",
    textAlign: "center",
  },
  urduGreenText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#db3125", //'#5DB075',
    marginLeft: 10,
    marginTop: -20,
    textAlign: "center",
  },
  tablerow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderBottomColor: "#B8C1CC",
    borderBottomWidth: 1,
  },
  headerRow: {
    marginTop: 50,
    backgroundColor: "#5DB075", // Header row color
  },
  evenRow: {
    backgroundColor: "#F5F5F5", // Even row color
  },
  oddRow: {
    backgroundColor: "#EFF3F0", // Odd row color
  },
  rectangle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    width: 350,
    height: 150,
    margin: 30,
  },
  rectangleTitle: {
    color: "#5DB075",
    fontSize: 38,
    fontWeight: "bold",
  },
});

export default Chatbot;
