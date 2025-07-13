import "./App.css";
import NotesList from "./components/notes/NoteList";
import Header from "./components/layout/Header";
import { useState } from "react";

function App() {

  const [search, setSearch] = useState("");

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <NotesList  search={search} />
    </div>
  );
}

export default App;
