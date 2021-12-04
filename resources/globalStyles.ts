// Style and Theme used across app

import { StatusBar, StyleSheet } from 'react-native';

export const Theme = {
    // Colours
    HeaderColour: '#ff9000',
    HeaderColourText: '#fff',
    BodyColour: 'white',
    BodyColourText: 'black',
    BorderColour: '#ff6000',
    Body2ndColour: "#DEDEDE",

    // Countdown Colour
    CountDownText: "#009000",
    CountDownElapsedText: "#e00000",

    // Font / Text
    FontSizeTitle: 25,
    FontSizeHeading: 20,
    FontSizeSubHeading: 18,
    FontSizeDefault: 16,

    // Button
    btnColourToggle: 'white',
    btnColourToggleText: '#ff5000',
    btnColourNormal: '#ff5000',
    btnColourNormalText: 'white',
}


export const styles = StyleSheet.create({
    screen: {
        padding: 0,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: "100%"
    },
    appHeader: {
        backgroundColor: Theme.HeaderColour,
        padding: 5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: StatusBar.currentHeight? StatusBar.currentHeight + 40 : 40
    },
    textHeader: {
        color: Theme.HeaderColourText,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: Theme.FontSizeTitle,
    },
    appBody: {
        backgroundColor: Theme.BodyColour,
        color: Theme.BodyColourText,
        fontSize: Theme.FontSizeDefault,
        padding: 0,
        flex: 1,
    },
    appFooter: {
        backgroundColor: Theme.HeaderColour,
        padding: 5,
        alignItems: 'flex-end'
    },
    textFooter: {
        color: Theme.HeaderColourText,
        fontSize: Theme.FontSizeDefault,
    },

    raceItem: {
        backgroundColor: Theme.HeaderColour,
        padding: 5,
    },

    input: {
        borderColor: "#000000",
        borderWidth: 1,
        padding: 10,
        width: "80%",
    },
    addPanel: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    }
});
