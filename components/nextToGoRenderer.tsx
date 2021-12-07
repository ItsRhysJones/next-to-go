import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, StyleSheet, Text, Button } from "react-native"
import RaceInfoList from './raceList'
import CategoryFilter from './categoryFilter'
import { incrementRaceCountDowns, initRaceDataApi } from "../store/actions";
import { useDispatch } from "react-redux";
import Clock from "./clock";
import { Theme } from "../resources/globalStyles";

/** Renderer is responsible for handling App Body
 * Manages data fetch from API and rendering of components
 * @returns 
 */
function Renderer() {

    const [isLoading, setLoading] = useState<boolean>(true)
    const [isError, setIsError] = useState<boolean>(false)
    const [retry, setRetry] = useState<boolean>(true)

    const dispatch = useDispatch();

    // Executes on first render and on initiating a 'rety'
    useEffect(() => {
        // Triggers initial data fetch.
        // On Success - Loading screen is disabled and data displays
        // On Failure - Retry prompt appears
        const loadData = async () => {
            let success = await initRaceDataApi(dispatch)
            setLoading(false)
            setIsError(!success)
        }
        loadData()
    }, [dispatch, retry])

    /** Increments the countdown timer and cleans up expired races
     */
    const updateSecondAction = () => {
        dispatch(incrementRaceCountDowns())
    }

    /** Retry function trigger Effect to poll data from API with state change
     * Resets IsLoading and IsError states to initial values
     */
    const triggerRetry = () => {
        setLoading(true)
        setIsError(false)
        setRetry(!retry)
    }

    // Returns loading widget
    if (isLoading)
        return (
            <View style={localStyles.ActivityIndicator}>
                <ActivityIndicator size="large" color={Theme.btnColourNormal} />
            </View>
        )

    // Returns retry prompt
    if (isError)
        return (
            <View style={localStyles.RetryMenuOuter}>
                <View style = {localStyles.RetryMenuInner}><Text style={localStyles.Message}>There was a problem loading data.</Text></View>
                <View style = {localStyles.RetryMenuInner}><Button color={Theme.btnColourNormal} onPress={triggerRetry} title="Retry"/></View>
            </View>
        )

    // Retruns race list and filter control
    return (
        <View>
            <CategoryFilter />
            <RaceInfoList />
            <Clock updateSecondAction={updateSecondAction} callApiAction={() => initRaceDataApi(dispatch)} />
        </View>
    )
}

const localStyles = StyleSheet.create({
    // Filter Bar
    ActivityIndicator: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: "100%",
        width: "100%",
    },
    RetryMenuOuter: {
        flexDirection: 'column',
        height: "100%",
        width: "100%",
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    RetryMenuInner: {
        width: "80%",
        margin: 5,
        alignItems: 'center',
    },
    Message: {
        color: Theme.BodyColourText,
        fontSize: Theme.FontSizeSubHeading,
    },
})


export default Renderer