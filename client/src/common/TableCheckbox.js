import React, { memo } from 'react';
import { Checkbox, withStyles } from "@material-ui/core";


function TableCheckbox({ prospect, isChecked, isHeader, handleChangeSelectedProspects }) {

    const HeaderCheckbox = withStyles((theme) => ({
        root: {
            color: theme.palette.secondary.main,
            '&$checked': {
                color: theme.palette.secondary.main,
            },
        },
        checked: {},
    }))((props) => <Checkbox {...props} />);
    

    return isHeader ? (
        <HeaderCheckbox
            value={prospect}
            disableRipple
            checked={isChecked}
            onChange={handleChangeSelectedProspects}
        />
    ) : (
        <Checkbox
            value={prospect}
            disableRipple
            color="primary"
            checked={isChecked}
            onChange={handleChangeSelectedProspects}
        />
    );
}

export default memo(TableCheckbox);