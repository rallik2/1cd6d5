import React, { useState } from 'react'
import axios from "axios";
import { useTableStyles } from "../../styles/table";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Button } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';


const ProspectsToCampaign = ({count, selectedProspects, selectedProspectsCount }) => {
    const { countModalWrapper, selectedCountTracker } = useTableStyles();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [campaignsAreLoading, setCampaignsAreLoading] = useState(false);
    const [campaignsSearchData, setCampaignsSearchData] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [selectedProspectIds, setSelectedProspectIds] = useState([]);

    const getSelectedProspectsIds = () => {
        const currentSelectedProspects = selectedProspects;
        const selectedProspectsToAdd = [];
        const selectedProspectsRawArray = Object.entries(currentSelectedProspects)
        selectedProspectsRawArray.forEach(([prospect, isSelected]) => {
            if (isSelected) {
                selectedProspectsToAdd.push(parseInt(prospect))
            };
        })
        setSelectedProspectIds(selectedProspectsToAdd);
    };
 
    const handleDialogOpen = () => {
        getSelectedProspectsIds()
        setDialogOpen(true)
    }
    const handleDialogClose = () => {
        setCampaignsSearchData([])
        setSelectedCampaign(null)
        setDialogOpen(false)
    }
    const handleConfirmAddToCampaign = async () => {
        if (selectedProspectIds.length < 1) {
            alert("Please select prospects before adding to a campaign");
            handleDialogClose();
            return;
        }
        if (!selectedCampaign) {
            alert("Please select a campaign");
            return;
        }
        const prospect_ids = selectedProspectIds;
        const count_prospects_to_add = prospect_ids.length;
        const { id } = selectedCampaign;
        if (prospect_ids && prospect_ids.length > 0 && id !== null) {
            try {
                const resp = await axios.post(
                    `/api/campaigns/${id}/prospects`,
                    { id, prospect_ids }
                );
                const count_prospects_added = resp.data.prospect_ids.length;
                if (count_prospects_added < count_prospects_to_add) {
                    const difference_added = count_prospects_to_add - count_prospects_added;
                    alert(`${difference_added} of ${count_prospects_to_add} prospects already in campaign`)
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
                {`${selectedProspectsCount} of ${count} selected`}
            </div>
            <Button size="small" variant="outlined" color="primary" onClick={handleDialogOpen}>
                Add to Campaign
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    {`Select a Campain to Add ${selectedProspectsCount} Prospects`}
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
                        onChange={(event, newValue) => {
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
                    <Button size="large" color="primary" onClick={handleConfirmAddToCampaign}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ProspectsToCampaign;
