import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function useIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/issues")
      .then((response) => setIssues(response.data));
  }, []);

  const refetchIssues = () => {
    axios
      .get("http://localhost:3001/issues")
      .then((response) => setIssues(response.data));
  };

  return { issues, setIssues, refetchIssues };
}

function IssueTable({ issues, onDeleteIssue, onUpdateIssue }) {
  const handleDeleteClick = (id) => {
    onDeleteIssue(id);
  };
  return (
    <table className="table-fixed w-full text-left">
      <thead>
        <tr>
          <th className="w-16">ID</th>
          <th>Title</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <IssueRow
            key={issue.id}
            issue={issue}
            onDeleteClick={handleDeleteClick}
            onUpdateIssue={onUpdateIssue}
          />
        ))}
      </tbody>
    </table>
  );
}

function IssueRow({ issue, onDeleteClick, onUpdateIssue }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleUpdateIssue = (data) => {
    axios
      .patch(`http://localhost:3001/issues/${issue.id}`, data)
      .then(onUpdateIssue);
    toggleEditing();
  };

  return (
    <>
      <tr key={issue.id}>
        <td>{issue.id}</td>
        <td>{issue.title}</td>
        <td>{issue.description}</td>
        <td className="flex justify-end">
          {!isEditing ? (
            <button
              className="mr-10 bg-blue-500 px-5 py-1 rounded-lg text-white hover:bg-blue-400"
              onClick={toggleEditing}
            >
              Edit
            </button>
          ) : (
            <button
              className="mr-10 bg-red-500 px-5 py-1 rounded-lg text-white hover:bg-red-400"
              onClick={toggleEditing}
            >
              Cancel
            </button>
          )}
          <button
            className="bg-red-500 px-5 py-1 rounded-lg text-white hover:bg-red-400"
            onClick={() => onDeleteClick(issue.id)}
          >
            Delete
          </button>
        </td>
      </tr>
      {isEditing && (
        <IssueEditForm issue={issue} onUpdateIssue={handleUpdateIssue} />
      )}
    </>
  );
}

function IssueEditForm({ issue, onUpdateIssue }) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);

  const handleSubmit = () => {
    onUpdateIssue({ title, description });
  };

  return (
    <tr>
      <td></td>
      <td>
        <input
          className="p-2 border-gray-400 border rounded-lg"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </td>
      <td>
        <input
          className="p-2 border-gray-400 border rounded-lg"
          name="title"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
      </td>
      <td className="flex justify-end">
        <button
          className="bg-green-500 px-5 py-1 rounded-lg text-white hover:bg-green-400"
          onClick={handleSubmit}
        >
          Update
        </button>
      </td>
    </tr>
  );
}

function IssueForm({ onAddIssue }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddIssue({ title, description });
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2" htmlFor="title">
        Title
      </label>
      <input
        className="mb-4 p-2 rounded-lg border border-gray-400"
        type="text"
        name="title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="mb-2" htmlFor="description">
        Description
      </label>
      <textarea
        className="mb-4 p-2 rounded-lg border border-gray-400"
        name="description"
        id="description"
        cols="30"
        rows="10"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="flex justify-end">
        <button
          className="bg-green-500 px-5 py-1 rounded-lg text-white hover:bg-green-400"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function App() {
  const { issues, setIssues, refetchIssues } = useIssues();
  const [addingIssue, setAddingIssue] = useState(false);

  const toggleAddingIssue = () => setAddingIssue(!addingIssue);

  const handleAddIssue = (data) => {
    axios.post("http://localhost:3001/issues", data).then(refetchIssues);
    toggleAddingIssue();
  };

  const handleDeleteIssue = (id) => {
    axios.delete(`http://localhost:3001/issues/${id}`).then(refetchIssues);
  };

  const handleIssueUpdate = () => {
    refetchIssues();
  };

  return (
    <div className="flex items-start justify-center h-full">
      <div className="p-12">
        <div className="mb-8">
          <h1 className="font-bold text-xl">Issues</h1>
        </div>
        <div className="mb-8">
          <div className="flex justify-end">
            {!addingIssue ? (
              <button
                className="bg-green-500 px-5 py-1 rounded-lg text-white hover:bg-green-400"
                onClick={toggleAddingIssue}
              >
                Add Issue
              </button>
            ) : (
              <button
                className="bg-red-500 px-5 py-1 rounded-lg text-white hover:bg-red-400"
                onClick={toggleAddingIssue}
              >
                Cancel
              </button>
            )}
          </div>
          {addingIssue && <IssueForm onAddIssue={handleAddIssue} />}
        </div>
        <div className="self-start">
          <IssueTable
            issues={issues}
            onDeleteIssue={handleDeleteIssue}
            onUpdateIssue={handleIssueUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
