import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Navbar from "../components/Navbar";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import { AuthContext } from "../context/AuthContext";
import * as Speech from "expo-speech";
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const Chatbot = ({ navigation }) => {
  const [sound, setSound] = React.useState(null);
  const [messages, setMessages] = useState([
    {
      role: "chatbot",
      content:
        "خوش آمدید! آپ کشف فاؤنڈیشن کے بارے میں معلومات لینے کے لیے یہاں اپنے سوال کر سکتے ہیں۔ آپ اردو میں بھی سوال لکھ کر پوچھ سکتے ہیں۔",
        roman: "Khush Aamdeed! Ap Kashf Foundation ke baray mein maloomat lene ke liye yahan apna savval kar saktay hain. Ap Urdu mein bhi savval likh kar poochh saktay hain.",
        audio: require('./../../assets/audios/chatbotintro.mp3')
    },
  ]);
  const [inputText, setInputText] = useState("");

  async function handleTextToSpeech(message) {
    const { sound } = await Audio.Sound.createAsync(message.audio);
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);  

  const urduToRomanMapping = {
    "ا": "a",
    "آ": "aa",
    "ب": "b",
    "پ": "p",
    "ت": "t",
    "ٹ": "tt",
    "ث": "th",
    "ج": "j",
    "چ": "ch",
    "ح": "h",
    "خ": "kh",
    "د": "d",
    "ڈ": "dd",
    "ذ": "z",
    "ر": "r",
    "ڑ": "rr",
    "ز": "z",
    "ژ": "zh",
    "س": "s",
    "ش": "sh",
    "ص": "s",
    "ض": "z",
    "ط": "t",
    "ظ": "z",
    "ع": "a",
    "غ": "gh",
    "ف": "f",
    "ق": "q",
    "ک": "k",
    "گ": "g",
    "ل": "l",
    "م": "m",
    "ن": "n",
    "و": "o",
    "ہ": "h",
    "ء": "e",
    "ی": "y",
    "ے": "e",
    // Add more mappings as needed
  };
  
  const convertToRomanUrdu = (urduText) => {
    let romanUrduText = "";
    
    for (let char of urduText) {
      if (urduToRomanMapping[char]) {
        romanUrduText += urduToRomanMapping[char];
      } else {
        romanUrduText += char; // If character not in mapping, keep it as is
      }
    }
    
    return romanUrduText;
  };  

  const sendMessage = () => {
    let _messages = [...messages];
    const newMessage = {
      role: "user",
      content: inputText,
      roman: convertToRomanUrdu(inputText),
      audio: ""
    };
    _messages.push(newMessage);

    let responseText =
      "معذرت، میں آپ کی بات سمجھ نہیں سکا۔ براہ کرم واضح کریں۔ آپ ہماری ہیلپ لائن +92-42-111-981-981 پر نمائندے سے رابطہ کر سکتے ہیں۔";
    let responseAudio = require('./../../assets/audios/maazrat.mp3')

    if (
      inputText.includes("کشف فاؤنڈیشن کون") ||
      inputText.includes("کشف فاؤنڈیشن کیا")
    ) {
      responseText =
        "کشف فاؤنڈیشن ایک مائیکرو فنانس ادارہ اور غیر منافع بخش تنظیم ہے جو پاکستان میں خواتین مائیکرو انٹرپرینیورز کو مالیاتی خدمات فراہم کرتی ہے۔";
        responseAudio = require('./../../assets/audios/whatiskashf.mp3')
    } else if (
      inputText.includes("کس قسم کے قرضے") ||
      inputText.includes("کس طرح کے قرضے")
    ) {
      responseText =
        " ہم آپ کو چھ طرح کے قرضے فراہم کرتے ہیں: کشف کاروبار قرضہ، کشف سکول سرمایہ، کشف ایزی لون، کشف مہویشی قرضہ، کشف مرحبہ پروڈکٹ، اور کشف سہولت قرضہ";
        responseAudio = require('./../../assets/audios/typesofloans.mp3')
    } else if (inputText.includes("قرضے کی شرائط")) {
      responseText =
        "ہر قرض کی مختلف شرائط ہوتی ہیں، جن میں واپسی کی مدت، سود کی شرح، اور قرض کی رقم شامل ہے۔ مزید معلومات کے لئے کشف فاؤنڈیشن کی ویب سائٹ یا قریبی برانچ سے رابطہ کریں۔";
        responseAudio = require('./../../assets/audios/loanterms.mp3')
    } else if (
      inputText.includes("قرضے کیسے") ||
      inputText.includes("قرض کی درخواست")
    ) {
        responseAudio = require('./../../assets/audios/howtoloan.mp3')
      responseText =
        "قرضے حاصل کرنے کے لئے آپ کو کشف فاؤنڈیشن کے دفتر میں درخواست دینا ہوگی اور کچھ ضروری دستاویزات جمع کرانی ہوں گی۔ آپ ہماری ایپ کے ذریعے بھی قرض کی درخواست درج کرا سکتے ہیں۔";
    } else if (inputText.includes("فنانشل لٹریسی ٹریننگ")) {
        responseAudio = require('./../../assets/audios/financial.mp3')
      responseText =
        "کشف فاؤنڈیشن مالیاتی خواندگی کی تربیت فراہم کرتی ہے تاکہ خواتین اپنے کاروبار کو بہتر طریقے سے چلانے کے قابل ہو سکیں۔";
    } else if (inputText.includes("ہدف")) {
        responseAudio = require('./../../assets/audios/aim.mp3')
      responseText =
        "کشف فاؤنڈیشن کا مقصد کم آمدنی والے گھرانوں، خاص طور پر خواتین کو مالیاتی خدمات فراہم کر کے انہیں خود مختار بنانا اور مالیاتی شمولیت کو فروغ دینا ہے۔";
    } else if (inputText.includes("ڈیجیٹل پلیٹ فارم")) {
        responseAudio = require('./../../assets/audios/app.mp3')
      responseText =
        " کشف فاؤنڈیشن نے ایک موبائل ایپ تیار کی ہے جو صارفین کو ان کے مالیاتی تفصیلات تک رسائی فراہم کرتی ہے اور انہیں دفتر جانے کی ضرورت نہیں پڑتی۔";
    } else if (inputText.includes("قرض کی واپسی")) {
        responseAudio = require('./../../assets/audios/returnloan.mp3')
      responseText =
        "قرض کی واپسی کے لئے آپ کو مقررہ قسطیں مقررہ وقت پر ادا کرنی ہوتی ہیں۔ آپ اپنی قسطوں کی تفصیلات کشف فاؤنڈیشن کی ایپ پر بھی دیکھ سکتے ہیں۔";
    } else if (inputText.includes("اہلیت")) {
        responseAudio = require('./../../assets/audios/ehliyat.mp3')
      responseText =
        "قرض حاصل کرنے کے لئے، آپ کو کشف فاؤنڈیشن کی کچھ اہلیت کی شرائط پوری کرنی ہوں گی، جن میں آمدنی کی حد اور کاروباری منصوبہ شامل ہیں۔";
    }

    const respMessage = {
      role: "chatbot",
      content: responseText,
      roman: convertToRomanUrdu(responseText),
      audio: responseAudio
    };
    _messages.push(respMessage);
    setMessages(_messages);

    setInputText("");
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.chatContainer}>
          <ScrollView>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.message,
                  message.role === "user"
                    ? styles.userMessage
                    : styles.chatbotMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (message.role == 'user') {
                        Speech.speak(message.roman);
                    }
                    else if (message.role == 'chatbot') {
                        handleTextToSpeech(message)
                    }
                  }}
                >
                  <Icon name="volume-up" size={30} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            style={styles.input}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
  },
  chatbotMessage: {
    backgroundColor: "#f1f1d6",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 90,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 25,
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
  },
});

export default Chatbot;
