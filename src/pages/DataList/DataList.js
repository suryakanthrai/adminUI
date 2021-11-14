import {Component} from 'react'
import {FiEdit} from 'react-icons/fi'
import {MdDelete} from 'react-icons/md'
import {FaSave} from 'react-icons/fa'
import {GiCancel} from 'react-icons/gi'

import './DataList.css'

class DataList extends Component {
  state = {
    dataList: [],
    editableContactId: '',
    name: '',
    role: '',
    email: '',
    activePage: 1,
    checkedList: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getBlogsData()
  }

  handleClick(event) {
    this.setState({activePage: Number(event.target.id)})
  }

  getBlogsData = async () => {
    const response = await fetch(
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json',
    )
    const data = await response.json()
    this.setState({dataList: data})
  }

  onChangeInput = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  /* ----------------------------Search Input Handlers-------------------------- */

  onChangeSearchInput = event => {
    const searchInput = event.target.value.toLowerCase()
    this.setState({searchInput})
  }

  /* ----------------------------pagination event handlers--------------------- */

  handleDoubleDecrementArrow = () => {
    this.setState({activePage: 1})
  }

  handleDecrementArrow = () => {
    this.setState(prevState => {
      if (prevState.activePage > 1) {
        return {activePage: prevState.activePage - 1}
      }
      return {activePage: prevState.activePage}
    })
  }

  handleIncrementArrow = () => {
    const {dataList} = this.state
    const lastPAge = Math.ceil(dataList.length / 10)
    this.setState(prevState => {
      if (prevState.activePage < lastPAge) {
        return {activePage: prevState.activePage + 1}
      }
      return {activePage: prevState.activePage}
    })
  }

  handleDoubleIncrementArrow = () => {
    const {dataList} = this.state
    const lastPAge = Math.ceil(dataList.length / 10)
    this.setState({activePage: lastPAge})
  }

  /* --------------------------------Editable action Events-------------------- */

  handleSave = (e, id) => {
    e.preventDefault()
    const {name, role, email, dataList} = this.state
    const elementIndex = dataList.findIndex(ele => ele.id === id)
    const newDataList = [...dataList]
    newDataList[elementIndex] = {
      ...newDataList[elementIndex],
      name,
      role,
      email,
    }
    console.log(id)
    this.setState({dataList: newDataList})
    this.setState({editableContactId: ''})
  }

  cancel = e => {
    e.preventDefault()
    this.setState({editableContactId: ''})
  }

  renderEditableRow = eachData => (
    <tr key={eachData.id}>
      <td>
        <input type="checkbox" className="checkbox" />
      </td>
      <td>
        <input
          className="input-edit"
          type="text"
          defaultValue={eachData.name}
          name="name"
          onChange={this.onChangeInput}
        />
      </td>
      <td>
        <input
          className="input-edit"
          type="text"
          defaultValue={eachData.email}
          name="email"
          onChange={this.onChangeInput}
        />
      </td>
      <td>
        <input
          className="input-edit"
          type="text"
          defaultValue={eachData.role}
          name="role"
          onChange={this.onChangeInput}
        />
      </td>
      <td className="icon-column">
        <FaSave
          className="action-green-icon"
          onClick={e => this.handleSave(e, eachData.id)}
        />
        <GiCancel className="action-red-icon" onClick={e => this.cancel(e)} />
      </td>
    </tr>
  )

  /* ----------------------delete event handlers--------------------- */

  delete = id => {
    const {dataList} = this.state
    const elementIndex = dataList.findIndex(ele => ele.id === id)
    if (elementIndex !== -1) {
      dataList.splice(elementIndex, 1)
    }
    this.setState({dataList})
  }

  handleEdit = (e, eachData) => {
    e.preventDefault()
    this.setState({
      editableContactId: eachData.id,
      name: eachData.name,
      role: eachData.role,
      email: eachData.email,
    })
  }

  deleteSelected = () => {
    const {checkedList} = this.state
    checkedList.forEach(ele => this.delete(ele))
    this.setState({checkedList: []})
  }

  onChecked = data => {
    const {checkedList} = this.state
    const idIndex = checkedList.findIndex(ele => ele === data)
    if (idIndex !== -1) {
      checkedList.splice(idIndex, 1)
    } else {
      checkedList.push(data)
    }
    this.setState({checkedList})
  }

  /* ----------------------Readable Rows------------------------- */

  renderReadOnlyRow = eachData => {
    const {checkedList} = this.state
    const selectedRow = checkedList.includes(eachData.id)
      ? 'selected-row'
      : null
    return (
      <tr key={eachData.id}>
        <td className={selectedRow}>
          <input
            type="checkbox"
            className="checkbox"
            onClick={() => this.onChecked(eachData.id)}
          />
        </td>
        <td className={selectedRow}>{eachData.name}</td>
        <td className={selectedRow}>{eachData.email}</td>
        <td className={selectedRow}>{eachData.role}</td>
        <td className={`icon-column ${selectedRow}`}>
          <FiEdit
            className="action-green-icon"
            onClick={e => this.handleEdit(e, eachData)}
          />
          <MdDelete
            className="action-red-icon"
            onClick={() => this.delete(eachData.id)}
          />
        </td>
      </tr>
    )
  }

  /* ------------------------Render Function------------------ */

  render() {
    const {dataList, editableContactId, activePage, searchInput} = this.state

    const filteredDataList = dataList.filter(
      ele =>
        ele.name.toLowerCase().includes(searchInput) ||
        ele.email.toLowerCase().includes(searchInput) ||
        ele.role.toLowerCase().includes(searchInput),
    )

    const indexOfLastItem = activePage * 10
    const indexOfFirstItem = indexOfLastItem - 10
    const currentDataList = filteredDataList.slice(
      indexOfFirstItem,
      indexOfLastItem,
    )

    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(filteredDataList.length / 10); i += 1) {
      pageNumbers.push(i)
    }

    return (
      <div className="table-container">
        <input
          type="search"
          placeholder="Search by name, email or role"
          onChange={e => this.onChangeSearchInput(e)}
          defaultValue={searchInput}
          className="search-input"
        />
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDataList.map(eachData => (
              <>
                {editableContactId === eachData.id
                  ? this.renderEditableRow(eachData)
                  : this.renderReadOnlyRow(eachData)}
              </>
            ))}
          </tbody>
        </table>
        <button
          className="delete-button"
          type="button"
          onClick={this.deleteSelected}
        >
          Delete Selected
        </button>
        <div className="pagination-container">
          <button
            type="button"
            className="arrow-btn"
            onClick={this.handleDoubleDecrementArrow}
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            className="arrow-btn"
            onClick={this.handleDecrementArrow}
          >
            &lt;
          </button>
          {pageNumbers.map(number => (
            <>
              {activePage === number ? (
                <button
                  type="button"
                  key={number}
                  id={number}
                  className="active page-btn"
                  onClick={e => this.handleClick(e)}
                >
                  {number}
                </button>
              ) : (
                <button
                  type="button"
                  key={number}
                  id={number}
                  className="page-btn"
                  onClick={e => this.handleClick(e)}
                >
                  {number}
                </button>
              )}
            </>
          ))}
          <button
            type="button"
            className="arrow-btn"
            onClick={this.handleIncrementArrow}
          >
            &gt;
          </button>
          <button
            type="button"
            className="arrow-btn"
            onClick={this.handleDoubleIncrementArrow}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    )
  }
}

export default DataList
