import "./App.css";
import NotesList from "./components/notes/NoteList";
import Header from "./components/layout/Header";

function App() {
  return (
    <div>
      <Header />
      <NotesList />
    </div>
  );
}

export default App;
