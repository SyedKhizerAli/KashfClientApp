import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen/MainScreen.js'; 
import LoginScreen from './screens/Login.js'; 
import SignupScreen from './screens/Signup.js';
import Dashboard from './screens/Dashboard.js';
import ComplaintsMainPage from './screens/Complaints/ComplaintsMainPage.js';
import LoanHistory from './screens/Loans/LoanHistory.js';
import LoanRequest from './screens/Loans/LoanRequest.js';
import ChangePhoneNumber from './screens/ChangePhoneNumber.js';
import NewComplaints from './screens/Complaints/NewComplaints.js';
import OtherComplaint from './screens/Complaints/OtherComplaint.js';
import ComplaintsHistory from './screens/Complaints/ComplaintsHistory.js';
// import App from '../App.js';
import LogoutButton from './components/LogoutButton.js';
import LoanRequestsMainPage from './screens/Loans/LoanRequestMainPage.js';
import LoanRequestHistory from './screens/Loans/LoanRequestHistory.js';
import Tutorial from './screens/Tutorial.js';
import Chatbot from './screens/Chatbot.js';
import Messages from './screens/Messages.js';

const Stack = createNativeStackNavigator();

const Navigation = ({ initial }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initial}>
                <Stack.Screen name="Main" component={MainScreen} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)',
                    }, headerShown: false,
                }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, headerShown: false,
                }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, headerShown: false,
                }} />
                <Stack.Screen name="Dashboard" component={Dashboard} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                    // headerRight: () => (
                    //     <LogoutButton navigation={navigation}/>
                    // ),
                }} />
                <Stack.Screen name="Complaints" component={ComplaintsMainPage} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="LoanHistory" component={LoanHistory} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="LoanRequest" component={LoanRequestsMainPage} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="NewLoanRequest" component={LoanRequest} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="LoanRequestHistory" component={LoanRequestHistory} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="ChangePhoneNumber" component={ChangePhoneNumber} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="NewComplaint" component={NewComplaints} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="OtherComplaint" component={OtherComplaint} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="ComplaintsHistory" component={ComplaintsHistory} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="Tutorial" component={Tutorial} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="Chatbot" component={Chatbot} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="Chatbot2" component={Messages} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                {/* <Stack.Screen name="Navigation" component={Navigation} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} />
                <Stack.Screen name="App" component={App} options={{
                    headerTitle: '', headerStyle: {
                        backgroundColor: 'rgba(203, 132, 124, 0.8)'
                    }, 
                }} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
