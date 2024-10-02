import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";

export default function Interface() {

    const time = useRef()

    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const jump = useKeyboardControls((state) => state.jump);

    useEffect(() => {
        addEffect(() => {
            console.log("tick")
        })
    }, [])


    return (
        <div className="interface">
            <div ref={time} className="time">
                <span>00:00</span>
            </div>
            { phase === 'ended' && <div className="restart" onClick={ restart }><span>Restart</span></div> }
           
            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={ `key ${ forward ? 'active' : '' }` }></div>
                </div>
                <div className="raw">
                    <div className={ `key ${ leftward ? 'active' : '' }` }></div>
                    <div className={ `key ${ backward ? 'active' : '' }` }></div>
                    <div className={ `key ${ rightward ? 'active' : '' }` }></div>
                </div>
                <div className="raw">
                    <div className={ `key large ${ jump ? 'active' : '' }` }></div>
                </div>
            </div>
        </div>
    )
}
