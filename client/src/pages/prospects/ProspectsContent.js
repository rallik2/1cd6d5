import React from "react";
import moment from "moment";

import { Grid, CircularProgress } from "@material-ui/core";

import PageTitle from "pages/mainlayout/PageTitle";
import PaginatedTable from "common/PaginatedTable";

const Content = ({
  paginatedData,
  isDataLoading,
  count,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  selectedProspects,
  selectedProspectsCount,
  isFullPageSelected,
  handleChangeSelectedProspects,
  handleCheckFullPageProspects,
  TableCheckbox
}) => {
  // console.log(paginatedData)
  const rowData = paginatedData.map((row) => [
    <TableCheckbox
      prospect={row.id}
      isChecked={selectedProspects[row.id]}
      handleChangeSelectedProspects={handleChangeSelectedProspects}
    />,
    row.email,
    row.first_name,
    row.last_name,
    moment(row.created_at).format("MMM d"),
    moment(row.updated_at).format("MMM d"),
  ]);
  return (
    <>
      <PageTitle>Prospects</PageTitle>
      {isDataLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <PaginatedTable
            paginatedData={paginatedData}
            selectedProspects={selectedProspects}
            selectedProspectsCount={selectedProspectsCount}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            headerColumns={[
              <TableCheckbox
                prospect={"header"}
                isChecked={isFullPageSelected}
                handleChangeSelectedProspects={handleCheckFullPageProspects}
              />,
              "Email",
              "First Name",
              "Last Name",
              "Created",
              "Updated",
            ]}
            rowData={rowData}
            renderProspectsCountModal={true}
        />
      )}
    </>
  );
};

export default Content;
