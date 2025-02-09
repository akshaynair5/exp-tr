function PersonList({ people }) {
    return (
      <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-200 mb-3">People</h3>
        <ul className="space-y-2">
          {people.map((person) => (
            <li 
              key={person.id} 
              className="p-3 bg-gray-800 text-gray-300 rounded-md shadow-sm hover:bg-gray-700 transition duration-200"
            >
              {person.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default PersonList;
  