import { StyleSheet } from "react-native"
import { Theme } from "../resources/globalStyles"
import React from "react"
import { View, Text, FlatList } from "react-native"
import { Race, RootReducer } from "../resources/definitions"
import { useSelector } from "react-redux"


function RaceList() {

    const races = useSelector((state: RootReducer) => state.Data.Races)

    /** Renders the races in card layout
     * @returns Flat List containing race info cards
     */
    const renderRaces = () => {
        return (
            <FlatList
                keyExtractor={(item) => item.Data.RaceId}
                data={races}
                renderItem={itemData => (renderRaceInfoCard(itemData.item))}
            />
        )
    }

    /** Renders a single race's info in a card layout
     * @param race 
     * @returns 
     */
    const renderRaceInfoCard = (race: Race) => {

        // Using card parttern as we have ample screen space

        // -----------------------------------------
        // | Race # 1 - Meeting           Category |
        // | --------------------------------------|
        // | Name: Race Name              Starts In|
        // | Start Time: 9:30am             5m 2s  |
        // -----------------------------------------

        const heading = `Race# ${race.Data.RaceNumber} - ${race.Data.MeetingName}`
        return (
            <View key={race.Data.RaceId} style={localStyles.RaceInfoCard}>
                <View style={localStyles.RaceInfoHeader}>
                    <Text style={localStyles.RaceInfoHeaderText}>{heading}</Text>
                    <Text style={localStyles.RaceInfoSubHeaderText}>{race.Category.Name}</Text>
                </View>
                <View style={localStyles.RaceInfoBody}>
                    <View style={{maxWidth: "75%"}}>
                        <Text style={localStyles.RaceInfoBodyText}>Name: {race.Data.RaceName}</Text>
                        <Text style={localStyles.RaceInfoBodyText}>Start Time: {displayDate(race.Data.AdvertisedStart)}</Text>
                    </View>
                    <View>
                        <Text style={localStyles.RaceInfoBodyText}>{race.Started ? "Started:" : "Starts In:"}</Text>
                        <Text style={
                            race.Started ? localStyles.CountDownElapsedText : localStyles.CountDownText
                        }>{displayCountDown(race.CountDown)}</Text>
                    </View>
                </View>
            </View>
        )
    }

    /** Formats a number countdown into a more readable string
     * @param time seconds in count down
     * @returns formatted string output of count down
     */
    const displayCountDown = (time: number) => {
        let output = ""
        let elapsed = false
        let push = (count: number, content: string, output: string) => {
            if (count > 0) {
                if (output != "") {
                    output += " "
                }
                output += content
            }
            return output
        }

        if (time < 0) {
            time *= -1
            elapsed = true
        }

        let hours = Math.floor(time / 3600)
        output = push(hours, `${hours}h`, output)
        let minutes = Math.floor(time % 3600 / 60)
        output = push(minutes, `${minutes}m`, output)
        let seconds = time % 60
        output = push(seconds, `${seconds}s`, output)

        if (elapsed) {
            output += " Ago"
        }

        return output
    }

    /** Displays the date formatted to local time from epoch
     * @param utcSeconds Epoch number value
     * @returns String value for formatted, localised date
     */
    const displayDate = (utcSeconds: number) => {
        let d = new Date(0);
        d.setUTCSeconds(utcSeconds);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
    }

    return (renderRaces())
}


// Used for race card layout
const localStyles = StyleSheet.create({
    SubHeading: {
        color: Theme.BodyColourText,
        backgroundColor: Theme.Body2ndColour,
        padding: 5
    },
    SubHeadingText: {
        color: Theme.BodyColourText,
        fontSize: Theme.FontSizeSubHeading,
        fontWeight: "bold"
    },
    RaceInfoCard: {
        borderWidth: 2,
        borderBottomLeftRadius: 15,
        borderTopRightRadius: 15,
        borderColor: Theme.BorderColour,
        padding: 0,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    RaceInfoHeader: {
        borderTopRightRadius: 12,
        backgroundColor: Theme.HeaderColour,
        padding: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    RaceInfoHeaderText: {
        color: Theme.HeaderColourText,
        fontSize: Theme.FontSizeHeading,
        fontWeight: "bold"
    },
    RaceInfoSubHeaderText: {
        color: Theme.HeaderColourText,
        fontSize: Theme.FontSizeSubHeading,
        fontWeight: "bold"
    },
    RaceInfoBody: {
        backgroundColor: Theme.BodyColour,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomLeftRadius: 12,
    },
    RaceInfoBodyText: {
        fontSize: Theme.FontSizeDefault,
        color: Theme.BodyColourText
    },
    CountDownText: {
        fontSize: Theme.FontSizeDefault,
        color: Theme.CountDownText
    },
    CountDownElapsedText: {
        fontSize: Theme.FontSizeDefault,
        color: Theme.CountDownElapsedText
    }
})


export default RaceList