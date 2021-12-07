import React from "react"
import { API_CALL_TIME_DELAY as API_CALL_TICK_DELAY } from "../resources/definitions"


type ClockProps = {
    updateSecondAction: CallableFunction
    callApiAction: CallableFunction
}

type ClockState = {
    ticks: number
}

/** Clock component is used to trigger state updates for race countdown
 *  Clock also trigger data fetch from API based on API_CALL_TIME_DELAY
 */
class Clock extends React.Component<ClockProps, ClockState> {
    interval!: NodeJS.Timer

    constructor(props: ClockProps) {
        super(props)
        this.state = {
            ticks: 0
        }
    }

    /** increment function adjusts state and triggers Clock actions
     */
    increment = () => {
        let newStateTicks = this.state.ticks + 1

        this.props.updateSecondAction()

        if (newStateTicks > API_CALL_TICK_DELAY) {
            newStateTicks = 0
            this.props.callApiAction()
        }

        this.setState({
            ticks: newStateTicks
        });

    }

    componentDidMount() {
        this.interval = setInterval(this.increment, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <></>
    }
}

export default Clock