import React, { useState } from 'react'
import axios from "axios";
import { useTableStyles } from "../../styles/table";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Button } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';


const ProspectsCountAddToCampaignModal = ({count, selectedProspects }) => {
    const { countModalWrapper, selectedCountTracker } = useTableStyles();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [campaignsAreLoading, setCampaignsAreLoading] = useState(false);
    const [campaignsSearchData, setCampaignsSearchData] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const modalButtonDisabled = selectedProspects.size < 1;
    const confirmButtonDisabled = selectedCampaign === null;
 
    const handleDialogOpen = () => {
        setDialogOpen(true);
    }
    const handleDialogClose = () => {
        setCampaignsSearchData([]);
        setSelectedCampaign(null);
        setDialogOpen(false);
    }
    const handleConfirmAddToCampaign = async () => {
        const selectedProspectsArray = [...selectedProspects];
        const countProspectsToAdd = selectedProspectsArray.length;
        const { id } = selectedCampaign;
        if (selectedProspectsArray && selectedProspectsArray.length > 0 && id !== null) {
            try {
                const resp = await axios.post(
                    `/api/campaigns/${id}/prospects`,
                    { id, prospect_ids: selectedProspectsArray }
                );
                const countProspectsAdded = resp.data.prospect_ids.length;
                if (countProspectsAdded < countProspectsToAdd) {
                    const differenceAdded = countProspectsToAdd - countProspectsAdded;
                    alert(`${differenceAdded} of ${countProspectsToAdd} prospects already in campaign`);
                }
            } catch (error) {
                console.error(error);
            }
        }
        handleDialogClose();
    }

    const handleSearchCampaigns = async (query) => {
        if (query === null || query === "") {
            return;
        };
        setCampaignsAreLoading(true);
        try {
            const resp = await axios.get(
                `/api/campaigns/search`,
                {params: {query}}
            );
            setCampaignsSearchData(resp.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCampaignsAreLoading(false);
        }
    };

    return (
        <div className={countModalWrapper}>
            <div className={selectedCountTracker}>
                {`${selectedProspects.size} of ${count} selected`}
            </div>
            <Button size="small" variant="outlined" color="primary" disabled={modalButtonDisabled} onClick={handleDialogOpen}>
                Add to Campaign
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    {`Select a Campaign to Add ${selectedProspects.size} Prospects`}
                </DialogTitle>
                <DialogContent>
                    <Autocomplete
                        id="campaigns-autocomplete"
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => option.name}
                        options={campaignsSearchData}
                        loading={campaignsAreLoading}
                        onInputChange={(event, newInput) => {
                            if (event.type === "change" && ( newInput !== null || newInput !== "")) {
                                handleSearchCampaigns(newInput);
                            }
                        }}
                        onChange={(_, newValue) => {
                            setSelectedCampaign(newValue)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select a Campaign"
                                variant="outlined"
                                autoFocus
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                    <React.Fragment>
                                        {params.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button size="large" color="primary" disabled={confirmButtonDisabled} onClick={handleConfirmAddToCampaign} >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProspectsCountAddToCampaignModal;
