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
  isFullPageSelected,
  handleChangeSelectedProspects,
  handleCheckFullPageProspects,
  TableCheckbox
}) => {
  const rowData = paginatedData.map((row) => [
    <TableCheckbox
      prospect={row.id}
      isHeader={false}
      isChecked={selectedProspects.has(row.id)}
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
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            headerColumns={[
              <TableCheckbox
                prospect={page}
                isHeader={true}
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
