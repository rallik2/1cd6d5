import React, { useState, useEffect } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import TableCheckbox from "common/TableCheckbox";
import ProspectsContent from "./ProspectsContent";
import axios from "axios";
import { DEFAULT_NUM_ROWS_PER_PAGE } from "../../constants/table";

const Prospects = () => {
  const [prospectsData, setProspectsData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_NUM_ROWS_PER_PAGE);
  const [count, setCount] = useState(0);
  const [isFullPageSelected, setIsFullPageSelected] = useState(false)
  const [selectedProspects, setSelectedProspects] = useState(() => new Set());

  const handleChangeRowsPerPage = (event, _) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (_, index) => {
    setCurrentPage(index);
  };

  const handleChangeSelectedProspects = (event) => {
    const isChecked = event.target.checked;
    const prospectToUpdate = parseInt(event.target.value)
    if (isChecked) {
      setSelectedProspects((selectedProspects) => {
        return new Set(selectedProspects).add(prospectToUpdate);
      })
    } else {
      setSelectedProspects((selectedProspects) => {
        const updatedSelectedProspects = new Set(selectedProspects);
        updatedSelectedProspects.delete(prospectToUpdate)
        return updatedSelectedProspects;
      })
    }

  };

  const handleCheckFullPageProspects = (event) => {
    const isChecked = event.target.checked;
    setIsFullPageSelected(isChecked)
    if (isChecked) {
      const fullPageCheck = new Set(selectedProspects);
      prospectsData.forEach((prospect) => fullPageCheck.add(prospect.id))
      setSelectedProspects(fullPageCheck)
    } else {
      const fullPageUncheck = new Set(selectedProspects);
      prospectsData.forEach((prospect) => fullPageUncheck.delete(prospect.id))
      setSelectedProspects(fullPageUncheck)
    }
  }

  useEffect(() => {
    const fetchProspects = async () => {
      setIsDataLoading(true);

      try {
        const resp = await axios.get(
          `/api/prospects?page=${currentPage}&page_size=${rowsPerPage}`,
        );
        if (resp.data.error) throw new Error(resp.data.error);
        setProspectsData(resp.data.prospects);
        setCount(resp.data.total);
        setIsFullPageSelected(false)
      } catch (error) {
        console.error(error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchProspects();
  }, [rowsPerPage, currentPage]);

  return (
    <>
      <Drawer
        RightDrawerComponent={
          <ProspectsContent
            isDataLoading={isDataLoading}
            paginatedData={prospectsData}
            count={count}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            selectedProspects={selectedProspects}
            isFullPageSelected={isFullPageSelected}
            handleChangeSelectedProspects={handleChangeSelectedProspects}
            handleCheckFullPageProspects={handleCheckFullPageProspects}
            TableCheckbox={TableCheckbox}
          />
        }
      />
    </>
  );
};

export default withAuth(Prospects);
