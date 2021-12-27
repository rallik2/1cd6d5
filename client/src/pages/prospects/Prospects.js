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
  // console.log(selectedProspects)
  // console.log(Object.entries(selectedProspects))
  // console.log(selectedProspectsCount)

  const handleChangeRowsPerPage = (event, _) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (_, index) => {
    setCurrentPage(index);
  };

  const handleChangeSelectedProspects = (event) => {
    // event.preventDefault()
    console.log("checked", event.target.checked)
    const countChange = event.target.checked ? 1 : -1;
    setSelectedProspects((curretlySelected) => ({
      ...curretlySelected,
      [event.target.value]: event.target.checked
    }))
    setSelectedProspectsCount((currentCount) => currentCount += countChange)
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
    // console.log(updatedProspectStateForPage)
    setIsFullPageSelected((currentlySelected) => !currentlySelected)
    setSelectedProspects(updatedProspectStateForPage.data)
    const changeInCount = isChecked ? updatedProspectStateForPage.count : -updatedProspectStateForPage.count;
    setSelectedProspectsCount((currentCount) => currentCount += changeInCount);
  }

  useEffect(() => {
    const initializeSelectedProsepectsState = (prospectsData, oldData) => {
      // console.log('old data', oldData);
      return prospectsData.reduce((selPros, pros) => {
        // console.log('selPros', selPros)
        if (!selPros[pros.id]) {
          selPros[pros.id] = false;
        }
        return selPros;
      }, { ...oldData } );
    }
    
    const fetchProspects = async () => {
      setIsDataLoading(true);

      try {
        const resp = await axios.get(
          `/api/prospects?page=${currentPage}&page_size=${rowsPerPage}`,
        );
        if (resp.data.error) throw new Error(resp.data.error);
        console.log(resp.data);
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
