const NoteItem = ({ note }) => {
  return (
    <div
      className={`flex flex-col justify-between p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl ${
      note.isPublic ? "bg-blue-100" : "bg-purple-100"
      } h-full min-h-[240px] w-full`}
    >

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{note.title}</h3>
        <hr className="mb-4 border-gray-300" />
        <p className="text-gray-700 mb-6 leading-relaxed">
           {note.content.length > 100
           ? note.content.slice(0, 100) + "..."
           : note.content}
        </p>
</div>


      <div className="flex justify-between text-sm text-gray-600 mt-auto">
        <span>
          {new Date(note.createdAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>{note.authorName}</span>
      </div>
    </div>
  );
};

export default NoteItem;
