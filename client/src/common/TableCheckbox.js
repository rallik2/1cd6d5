import React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from "@material-ui/core";


export default function TableCheckbox({ isChecked, handleChange, type }) {

    const HeaderCheckbox = withStyles((theme) => ({
        root: {
            color: theme.palette.secondary.main,
            '&$checked': {
                color: theme.palette.secondary.main,
            },
        },
        checked: {},
    }))((props) => <Checkbox {...props} />);
    
    if (type === "header") {
        return <HeaderCheckbox disableRipple checked={isChecked} onChange={handleChange}/>
    } else {
        return (
            <Checkbox disableRipple color="primary" checked={isChecked} onChange={handleChange}/>
        )
    }
}
