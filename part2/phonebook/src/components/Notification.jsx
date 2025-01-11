export const Notification = ({ infoMessage, errorMessage }) => {
    return (infoMessage || errorMessage) ? <div className="notification">
        <div className="info">{infoMessage}</div>
        <div className="error">{errorMessage}</div>
    </div> : <div></div>
}