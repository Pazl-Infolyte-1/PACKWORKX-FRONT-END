const FluteTypeView = () => {
	return (
	  <div className="overflow-x-auto p-4">
		<table className="w-full border-collapse border border-gray-300">
		  <thead className="bg-gray-100 text-gray-700">
			<tr>
			  <th className="p-3 border border-gray-300">Flute</th>
			  <th className="p-3 border border-gray-300">Flute height (mm)</th>
			  <th className="p-3 border border-gray-300">
				Number of flutes per m length of the corrugated board
			  </th>
			  <th className="p-3 border border-gray-300">Take-up factor</th>
			  <th className="p-3 border border-gray-300">
				Glue consumption g/m², glue layer
			  </th>
			</tr>
		  </thead>
		  <tbody className="text-gray-900">
			<tr className="bg-white border border-gray-300">
			  <td className="p-3 border border-gray-300">A</td>
			  <td className="p-3 border border-gray-300">4.8</td>
			  <td className="p-3 border border-gray-300">110</td>
			  <td className="p-3 border border-gray-300">1.50-1.55</td>
			  <td className="p-3 border border-gray-300">4.5-5.0</td>
			</tr>
			<tr className="bg-gray-50 border border-gray-300">
			  <td className="p-3 border border-gray-300">B</td>
			  <td className="p-3 border border-gray-300">2.4</td>
			  <td className="p-3 border border-gray-300">150</td>
			  <td className="p-3 border border-gray-300">1.30-1.35</td>
			  <td className="p-3 border border-gray-300">5.5-6.0</td>
			</tr>
			<tr className="bg-white border border-gray-300">
			  <td className="p-3 border border-gray-300">C</td>
			  <td className="p-3 border border-gray-300">3.6</td>
			  <td className="p-3 border border-gray-300">130</td>
			  <td className="p-3 border border-gray-300">1.40-1.45</td>
			  <td className="p-3 border border-gray-300">5.0-5.5</td>
			</tr>
			<tr className="bg-gray-50 border border-gray-300">
			  <td className="p-3 border border-gray-300">E</td>
			  <td className="p-3 border border-gray-300">1.2</td>
			  <td className="p-3 border border-gray-300">290</td>
			  <td className="p-3 border border-gray-300">1.20-1.35</td>
			  <td className="p-3 border border-gray-300">6.0-6.5</td>
			</tr>
			<tr className="bg-white border border-gray-300">
			  <td className="p-3 border border-gray-300">F, G, N</td>
			  <td className="p-3 border border-gray-300">0.5-0.8</td>
			  <td className="p-3 border border-gray-300">400-550</td>
			  <td className="p-3 border border-gray-300">1.15-1.25</td>
			  <td className="p-3 border border-gray-300">9.0-11.0</td>
			</tr>
		  </tbody>
		</table>
	  </div>
	);
  };
  
  export default FluteTypeView;
  