import { Card, CardContent, Typography } from '@material-ui/core';
import './infoBox.css'
const InfoBox = ({title,cases,total,onClick,active, isGreen}) => (
    // use callback to pass the onClick.
    <Card className={ `box ${active && 'box--selected'}`} onClick={onClick}>
    <CardContent>
        <Typography className="box__title" color="textSecondary">
            {title}
        </Typography>
        <h2 className={`box__cases ${isGreen && 'box__cases--green'}`}>
            {cases}
        </h2>
        <Typography className="box__total" color="textSecondary" > {total}</Typography>
    </CardContent>
    </Card>
)


export default InfoBox