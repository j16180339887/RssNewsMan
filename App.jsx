import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

// import {
//     createStackNavigator
// } from "react-navigation";
import Setting from "./src/Setting.jsx";

// const SettingPage = createStackNavigator({
//     Profile: {
//         screen: Setting,
//         navigationOptions: ({
//             navigation
//         }) => ({
//             header: null
//             // title: "hiii",
//             // headerTitleStyle: {
//             //     textAlign: 'center',
//             //     alignSelf: 'center',
//             //     color: "green",
//             //     backgroundColor: 'black',
//             // },
//             // headerStyle: {
//             //     backgroundColor: 'black',
//             // },
//         }),
//     },
// });

export default class App extends React.Component {
    render() {
        return ( <Setting /> );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center',
        paddingTop: 20,
        justifyContent: 'center',
    },
    whiteText: {
        color: "white"
    },
});
