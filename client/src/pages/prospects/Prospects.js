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
  const [isFullPageSelected, setIsFullPageSelected] = useState(null)
  const [selectedProspects, setSelectedProspects] = useState({});
  const [selectedProspectsCount, setSelectedProspectsCount] = useState(0);

  const handleChangeRowsPerPage = (event, _) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (_, index) => {
    setCurrentPage(index);
  };

  const handleChangeSelectedProspects = (event) => {
    setSelectedProspects((currentlySelected) => ({
      ...currentlySelected,
      [event.target.value]: event.target.checked
    }))
    const countChangeSingle = event.target.checked ? 1 : -1;

    setSelectedProspectsCount((currentCount) => currentCount += countChangeSingle)
  };

  const handleCheckFullPageProspects = (event) => {
    const isChecked = event.target.checked;
    const currentPageProspects = prospectsData;
    const currentSelectedProspects = selectedProspects;
    let count = 0;
    const updatedProspectStateForPage = currentPageProspects.reduce((fullPagePros, pros) => {
      if (fullPagePros.data[pros.id] !== isChecked) {
        fullPagePros.data[pros.id] = isChecked;
        fullPagePros.count += 1;
      }
      return fullPagePros;
    }, { data: { ...currentSelectedProspects }, count })
    setIsFullPageSelected((currentlySelected) => !currentlySelected)
    setSelectedProspects(updatedProspectStateForPage.data)
    const countChangeFullPage = isChecked ? updatedProspectStateForPage.count : -updatedProspectStateForPage.count;
    setSelectedProspectsCount((currentCount) => currentCount += countChangeFullPage);
  }

  useEffect(() => {
    const initializeSelectedProsepectsState = (prospectsDataNewPage, currentProspectsData) => {
      return prospectsDataNewPage.reduce((selProsObj, pros) => {
        if (!selProsObj[pros.id]) {
          selProsObj[pros.id] = false;
        }
        return selProsObj;
      }, { ...currentProspectsData } );
    }
    
    const fetchProspects = async () => {
      setIsDataLoading(true);

      try {
        const resp = await axios.get(
          `/api/prospects?page=${currentPage}&page_size=${rowsPerPage}`,
        );
        if (resp.data.error) throw new Error(resp.data.error);
        setProspectsData(resp.data.prospects);
        setCount(resp.data.total);
        setSelectedProspects((selected) =>
          initializeSelectedProsepectsState(resp.data.prospects, selected)
        )
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
            selectedProspectsCount={selectedProspectsCount}
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
