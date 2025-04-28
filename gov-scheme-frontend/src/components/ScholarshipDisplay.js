import React from 'react';

// This component will parse and render the formatted scholarship information
const ScholarshipDisplay = ({ responseText }) => {
  // Function to parse the markdown-like text from the API
  const parseScholarshipData = (text) => {
    // Split by scheme sections (starting with # or ##)
    const sections = text.split(/(?=# 🎓|## 🎓)/g).filter(Boolean);
    
    return sections.map((section, index) => {
      // Skip "Additional Information" section for special handling
      if (section.includes("# Additional Information")) {
        return null;
      }
      
      // Extract scheme name
      const nameMatch = section.match(/# 🎓 (.*?)(?:\n|$)/);
      const name = nameMatch ? nameMatch[1] : "Scholarship Scheme";
      
      // Extract description
      const descMatch = section.match(/\*\*🔎 Description:\*\*\s*([\s\S]*?)(?=\*\*✅ Eligibility|\*\*🎁 Benefits|$)/);
      const description = descMatch ? descMatch[1].trim() : "";
      
      // Extract eligibility criteria
      const eligibilityMatch = section.match(/\*\*✅ Eligibility:\*\*\s*([\s\S]*?)(?=\*\*🎁 Benefits|\*\*🌐 Official|\-\-\-|$)/);
      const eligibilityText = eligibilityMatch ? eligibilityMatch[1].trim() : "";
      const eligibility = eligibilityText.split(/- /).filter(Boolean).map(item => item.trim());
      
      // Extract benefits
      const benefitsMatch = section.match(/\*\*🎁 Benefits:\*\*\s*([\s\S]*?)(?=\*\*🌐 Official|\-\-\-|$)/);
      const benefitsText = benefitsMatch ? benefitsMatch[1].trim() : "";
      const benefits = benefitsText.split(/- /).filter(Boolean).map(item => item.trim());
      
      // Extract official link
      const linkMatch = section.match(/\*\*🌐 Official Link:\*\*\s*([\s\S]*?)(?=\-\-\-|$)/);
      const link = linkMatch ? linkMatch[1].trim() : "";
      
      return {
        id: index,
        name,
        description,
        eligibility,
        benefits,
        link
      };
    }).filter(Boolean); // Remove null entries
  };
  
  // Extract the "Additional Information" section
  const extractAdditionalInfo = (text) => {
    const additionalInfoMatch = text.match(/# Additional Information([\s\S]*?)$/);
    if (!additionalInfoMatch) return null;
    
    const additionalInfoText = additionalInfoMatch[1];
    
    // Extract notes
    const notesMatch = additionalInfoText.match(/\*\*Important Notes:\*\*\s*([\s\S]*?)(?=\*\*Application Deadlines|\*\*Useful Resources|$)/);
    const notesText = notesMatch ? notesMatch[1].trim() : "";
    const notes = notesText.split(/- /).filter(Boolean).map(item => item.trim());
    
    // Extract deadlines
    const deadlinesMatch = additionalInfoText.match(/\*\*Application Deadlines:\*\*\s*([\s\S]*?)(?=\*\*Useful Resources|$)/);
    const deadlinesText = deadlinesMatch ? deadlinesMatch[1].trim() : "";
    const deadlines = deadlinesText.split(/- /).filter(Boolean).map(item => item.trim());
    
    // Extract resources
    const resourcesMatch = additionalInfoText.match(/\*\*Useful Resources:\*\*\s*([\s\S]*?)$/);
    const resourcesText = resourcesMatch ? resourcesMatch[1].trim() : "";
    const resources = resourcesText.split(/- /).filter(Boolean).map(item => item.trim());
    
    return {
      notes,
      deadlines,
      resources
    };
  };
  
  if (!responseText) {
    return <div className="loading">Waiting for recommendations...</div>;
  }
  
  // Parse the response text
  const schemes = parseScholarshipData(responseText);
  const additionalInfo = extractAdditionalInfo(responseText);
  
  return (
    <div className="scholarship-results">
      <h3 className="recommendations-title">Recommended Scholarships</h3>
      
      {schemes.map((scheme) => (
        <div key={scheme.id} className="scholarship-card">
          <h4 className="scheme-name">🎓 {scheme.name}</h4>
          
          <div className="scheme-description">
            <strong>🔎 Description:</strong>
            <p>{scheme.description}</p>
          </div>
          
          <div className="scheme-eligibility">
            <strong>✅ Eligibility:</strong>
            <ul>
              {scheme.eligibility.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="scheme-benefits">
            <strong>🎁 Benefits:</strong>
            <ul>
              {scheme.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          {scheme.link && (
            <div className="scheme-link">
              <strong>🌐 Official Link:</strong>
              <p>{scheme.link}</p>
            </div>
          )}
        </div>
      ))}
      
      {additionalInfo && (
        <div className="additional-info">
          <h4>Additional Information</h4>
          
          {additionalInfo.notes.length > 0 && (
            <div className="info-notes">
              <strong>Important Notes:</strong>
              <ul>
                {additionalInfo.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          {additionalInfo.deadlines.length > 0 && (
            <div className="info-deadlines">
              <strong>Application Deadlines:</strong>
              <ul>
                {additionalInfo.deadlines.map((deadline, i) => (
                  <li key={i}>{deadline}</li>
                ))}
              </ul>
            </div>
          )}
          
          {additionalInfo.resources.length > 0 && (
            <div className="info-resources">
              <strong>Useful Resources:</strong>
              <ul>
                {additionalInfo.resources.map((resource, i) => (
                  <li key={i}>{resource}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScholarshipDisplay;