import React from "react";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import MUIDataTable from "../src/MUIDataTable";
import MUIDataTablePagination from "../src/MUIDataTablePagination";

describe("<MUIDataTable />", function() {
  let data;
  let columns;

  before(() => {
    columns = ["First Name", "Company", "City", "State"];
    data = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];

  });

  it("should render a table", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    assert.strictEqual(shallowWrapper.dive().name(), "Paper");
  });


  it("should correctly build internal columns data structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const actualResult = shallowWrapper.state().columns;
    const expectedResult = [
      { display: true, name: "First Name", sort: "desc" },
      { display: true, name: "Company", sort: "desc" },
      { display: true, name: "City", sort: "desc" },
      { display: true, name: "State", sort: "desc" },
    ];

    assert.deepEqual(actualResult, expectedResult);
  });


  it("should correctly build internal table data and displayData structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(state.displayData, data);    
  });

  it("should correctly build internal filterList structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.state();
    const expectedResult = [[],[],[],[]];

    assert.deepEqual(state.filterList, expectedResult);  
  });


  it("should correctly build internal unique column data for filterData structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.state();
    const expectedResult = [
      ["Joe James", "John Walsh", "Bob Herm", "James Houston"],
      ["Test Corp"],
      ["Yonkers", "Hartford", "Tampa", "Dallas"],
      ["NY", "CT", "FL", "TX"],
    ];

    assert.deepEqual(state.filterData, expectedResult);  
  });


  it("should correctly build internal rowsPerPage when provided in options", () => {

    const options = {
      rowsPerPage: 20
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.state();
    assert.strictEqual(state.rowsPerPage, 20);

  });


  it("should correctly build internal rowsPerPageOptions when provided in options", () => {
    
    const options = {
      rowsPerPageOptions: [5, 10, 15]
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.state();
    assert.deepEqual(state.rowsPerPageOptions, [5, 10, 15]);
    
  });


  it("should render pagination when enabled in options", () => {

    const options = {
      pagination: true
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(MUIDataTablePagination);
    assert.lengthOf(actualResult, 1);

  });

  it("should not render pagination when disabled in options", () => {

    const options = {
      pagination: false
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(MUIDataTablePagination);
    assert.lengthOf(actualResult, 0);


  });

  it("should properly set internal filterList when calling filterUpdate method", () => {

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);

  });

  it("should properly reset internal filterList when calling resetFilters method", () => {

    // set a filter
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    // now remove it
    let state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);

    instance.resetFilters();
    table.update();
    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);

  });

  it("should properly set searchText when calling searchTextUpdate method", () => {

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();

    instance.searchTextUpdate("Joe James");
    table.update();
    const state = table.state();

    assert.deepEqual(state.displayData, [["Joe James", "Test Corp", "Yonkers", "NY"]]);

  });
  
});