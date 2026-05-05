
import React, { useState } from 'react';
import { Pig, PigStatus } from '../types';
import { exportToPDF, exportToExcel } from '../services/exportService';

interface PigManagerProps {
  pigs: Pig[];
  onAddPigClick: () => void;
  onSelectPig: (pig: Pig) => void;
}

const PigManager: React.FC<PigManagerProps> = ({ pigs, onAddPigClick, onSelectPig }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPigs = pigs.filter(pig =>
    pig.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pig.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Livestock DB</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => {
            const columns = ['Tag ID', 'Breed', 'Gender', 'Stage', 'Status', 'Pen', 'Weight'];
            const data = pigs.map(p => [p.tagId, p.breed, p.gender, p.stage, p.status, p.penLocation, p.weight]);
            exportToPDF('Livestock Report', columns, data, 'livestock_report.pdf');
          }} className="flex-1 sm:flex-none justify-center bg-white text-gray-600 px-3 py-2 rounded-xl font-bold text-[10px] border border-gray-200 hover:bg-gray-50 flex items-center">
            <i className="fas fa-file-pdf text-red-500 mr-1 shadow-sm"></i> PDF
          </button>
          <button onClick={() => {
            exportToExcel('livestock_report.xlsx', 'Livestock', pigs);
          }} className="flex-1 sm:flex-none justify-center bg-white text-gray-600 px-3 py-2 rounded-xl font-bold text-[10px] border border-gray-200 hover:bg-gray-50 flex items-center">
            <i className="fas fa-file-excel text-green-600 mr-1 shadow-sm"></i> Excel
          </button>
          <button
            onClick={onAddPigClick}
            className="w-full sm:w-auto bg-ecomattGreen text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-green-900/10 hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus"></i> New Animal
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <i className="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search ID, Breed..."
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:border-ecomattGreen focus:ring-1 focus:ring-ecomattGreen transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredPigs.map((pig) => {
          const isSow = pig.stage === 'Sow';
          const iconBg = isSow ? 'bg-green-100' : (pig.gender === 'Male' ? 'bg-blue-100' : 'bg-gray-100');
          const iconColor = isSow ? 'text-green-600' : (pig.gender === 'Male' ? 'text-blue-600' : 'text-gray-600');
          const icon = isSow ? 'fa-piggy-bank' : 'fa-venus-mars';

          return (
            <div
              key={pig.id}
              onClick={() => onSelectPig(pig)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-ecomattGreen transition-colors cursor-pointer active:scale-[0.98] transform duration-100"
            >
              <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center ${iconColor} text-xl shrink-0`}>
                <i className={`fas ${icon}`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-base">{pig.tagId}</h4>
                <p className="text-xs text-gray-500">{pig.breed} • {pig.stage} • {pig.penLocation}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block
                                ${pig.status === PigStatus.Active ? 'bg-green-100 text-green-700' :
                      pig.status === PigStatus.Sick ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                             `}>
                    {pig.status}
                  </span>
                  {pig.weight && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">{pig.weight}kg</span>}
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-300"></i>
            </div>
          );
        })}

        {filteredPigs.length === 0 && (
          <div className="text-center py-10">
            <i className="fas fa-search text-gray-300 text-4xl mb-3"></i>
            <p className="text-gray-500 text-sm">No records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PigManager;
