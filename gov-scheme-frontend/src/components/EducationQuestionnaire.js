import React, { useState } from 'react';
import { sendAnswersToGemini } from '../api'; // Updated function

const EducationQuestionnaire = ({ onComplete, onAnswer }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');

  // Questions array with conditional rendering logic - state question first, then in logical order
  const questions = [
    {
      type: 'input',
      question: 'In which state do you reside?',
      key: 'state'
    },
    {
      type: 'select',
      question: 'Do you belong to a rural or urban area?',
      options: ['Rural', 'Urban', 'Semi-Urban'],
      key: 'areaType'
    },
    {
      type: 'select',
      question: 'What is your age group?',
      options: [
        'Under 10 years',
        '10-14 years',
        '15-18 years',
        '19-25 years',
        '26-35 years',
        '36 and above'
      ],
      key: 'ageGroup'
    },
    {
      type: 'select',
      question: 'What is your current education level?',
      options: [
        'Primary School (Class 1-5)',
        'Middle School (Class 6-8)',
        'High School (Class 9-10)',
        'Higher Secondary (Class 11-12)',
        'Undergraduate',
        'Postgraduate',
        'Professional Degree',
        'Not Currently Studying'
      ],
      key: 'educationLevel',
      dependsOn: {
        key: 'ageGroup',
        validOptions: ['10-14 years', '15-18 years', '19-25 years', '26-35 years', '36 and above']
      }
    },
    {
      type: 'select',
      question: 'What is your primary field of study?',
      options: [
        'Science & Technology',
        'Engineering',
        'Medical',
        'Arts & Humanities',
        'Commerce',
        'Management',
        'Law',
        'Other'
      ],
      key: 'fieldOfStudy',
      dependsOn: {
        key: 'educationLevel',
        validOptions: ['Undergraduate', 'Postgraduate', 'Professional Degree']
      }
    },
    {
      type: 'select',
      question: 'Are you the first generation in your family to pursue higher education?',
      options: ['Yes', 'No'],
      key: 'firstGenerationStudent',
      dependsOn: {
        key: 'educationLevel',
        validOptions: ['Undergraduate', 'Postgraduate', 'Professional Degree']
      }
    },
    {
      type: 'select',
      question: 'Are you currently employed?',
      options: ['Full-time Student', 'Part-time Student', 'Working Part-time', 'Unemployed'],
      key: 'employmentStatus',
      dependsOn: {
        key: 'ageGroup',
        validOptions: ['19-25 years', '26-35 years', '36 and above']
      }
    },
    {
      type: 'select',
      question: 'What is your social category?',
      options: [
        'General',
        'SC (Scheduled Caste)',
        'ST (Scheduled Tribe)',
        'OBC (Other Backward Class)',
        'Economically Weaker Section (EWS)',
        'Minority Community'
      ],
      key: 'socialCategory'
    },
    {
      type: 'select',
      question: 'What is your annual family income?',
      options: [
        'Below ₹1 lakh',
        '₹1 lakh - ₹2.5 lakhs',
        '₹2.5 lakhs - ₹5 lakhs',
        '₹5 lakhs - ₹10 lakhs',
        'Above ₹10 lakhs'
      ],
      key: 'familyIncome',
      dependsOn: {
        key: 'educationLevel',
        validOptions: [
          'High School (Class 9-10)',
          'Higher Secondary (Class 11-12)',
          'Undergraduate',
          'Postgraduate',
          'Professional Degree'
        ]
      }
    },
    {
      type: 'select',
      question: 'Do you have any disability?',
      options: [
        'No Disability',
        'Physical Disability',
        'Visual Impairment',
        'Hearing Impairment',
        'Other Disabilities'
      ],
      key: 'disability'
    },
    {
      type: 'select',
      question: 'Have you received any scholarships before?',
      options: ['Yes, multiple times', 'Yes, once', 'No, never'],
      key: 'previousScholarships'
    },
    {
      type: 'select',
      question: 'Do you require financial assistance for education?',
      options: ['Urgent Need', 'Moderate Need', 'Minor Need', 'No Need'],
      key: 'financialNeed'
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [questions[currentStep].key]: answer };
    setAnswers(newAnswers);

    if (typeof onAnswer === 'function') {
      onAnswer(questions[currentStep].question, answer);
    }

    if (currentStep < questions.length - 1) {
      const nextStep = currentStep + 1;
      const nextQuestion = questions[nextStep];
      if (nextQuestion.dependsOn) {
        const dependencyMet = nextQuestion.dependsOn.validOptions.includes(
          newAnswers[nextQuestion.dependsOn.key]
        );
        if (!dependencyMet) {
          handleSkipQuestion();
          return;
        }
      }
      setCurrentStep(nextStep);
    } else {
      // Get recommendations from Gemini API and pass to parent component
      sendAnswersToGemini(newAnswers)
        .then(response => {
          // Display the response in chat instead of console.log
          if (typeof onComplete === 'function') {
            onComplete(newAnswers, response);
          }
        })
        .catch(error => {
          console.error("Error sending to API:", error);
          if (typeof onComplete === 'function') {
            onComplete(newAnswers, "Sorry, I couldn't fetch scheme recommendations at this moment.");
          }
        });
    }
    setInputValue('');
  };

  const handleSkipQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="education-questionnaire">
      <div className="question-container">
        <p>{currentQuestion.question}</p>
        {currentQuestion.type === 'select' && (
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)} className="option-button">{option}</button>
            ))}
          </div>
        )}
        {currentQuestion.type === 'input' && (
          <div className="input-container">
            <input 
              type="text" 
              placeholder="Enter your answer" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && inputValue.trim() && handleAnswer(inputValue)}
            />
            <button 
              onClick={() => inputValue.trim() && handleAnswer(inputValue)} 
              className="option-button"
              disabled={!inputValue.trim()}
            >
              Submit
            </button>
          </div>
        )}
        {currentQuestion.type === 'select' && <button onClick={handleSkipQuestion} className="skip-button">Skip</button>}
      </div>
      <div className="progress">Step {currentStep + 1} of {questions.length}</div>
    </div>
  );
};

export default EducationQuestionnaire;