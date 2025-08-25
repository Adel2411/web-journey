import "./App.css";
import Header from "./components/layout/Header";
import NoteList from "./components/notes/NoteList";

const App = () => {
  return (
    <div className="bg-[#0e0e1b] text-white min-h-screen overflow-x-hidden">
      <Header />
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
        <NoteList />
      </main>
    </div>
  );
};

export default App;
