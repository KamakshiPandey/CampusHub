
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaMoon, FaBroom, FaSmoking, FaPaw, FaBook, FaUsers, FaUserFriends } from 'react-icons/fa';
import api from '../utils/api';

const questions = [
  {
    key: 'sleepSchedule',
    icon: <FaMoon />,
    question: "What's your sleep schedule like?",
    options: [
      { value: 'early_bird', label: 'Early Bird' },
      { value: 'night_owl', label: 'Night Owl' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
  {
    key: 'cleanliness',
    icon: <FaBroom />,
    question: 'How would you describe your cleanliness?',
    options: [
      { value: 'very_tidy', label: 'Very Tidy' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'relaxed', label: 'Relaxed' },
    ],
  },
  {
    key: 'smoking',
    icon: <FaSmoking />,
    question: 'Smoking preference?',
    options: [
      { value: 'non_smoker', label: 'Non Smoker' },
      { value: 'smoker', label: 'Smoker' },
      { value: 'no_preference', label: 'No Preference' },
    ],
  },
  {
    key: 'pets',
    icon: <FaPaw />,
    question: 'How do you feel about pets?',
    options: [
      { value: 'has_pets', label: 'I Have Pets' },
      { value: 'no_pets', label: 'No Pets' },
      { value: 'okay_with_pets', label: "Okay With Pets" },
    ],
  },
  {
    key: 'studyHabits',
    icon: <FaBook />,
    question: 'How do you prefer to study?',
    options: [
      { value: 'silent_study', label: 'Silent Study' },
      { value: 'music_ok', label: 'Music is Fine' },
      { value: 'group_study', label: 'Group Study' },
    ],
  },
  {
    key: 'socialLevel',
    icon: <FaUsers />,
    question: 'How would you describe yourself?',
    options: [
      { value: 'introvert', label: 'Introvert' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'extrovert', label: 'Extrovert' },
    ],
  },
  {
    key: 'guestsFrequency',
    icon: <FaUserFriends />,
    question: 'How often do you have guests over?',
    options: [
      { value: 'rarely', label: 'Rarely' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'often', label: 'Often' },
    ],
  },
];

const RoommateQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/quiz').then((res) => {
      if (res.data.quizCompleted) {
        setAnswers(res.data);
      }
    }).catch(() => {});
  }, []);

  const current = questions[step];

  const handleSelect = (value) => {
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 250);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/quiz', answers);
      toast.success('Preferences saved! We can now match you with roommates.');
      navigate('/roommates');
    } catch (err) {
      toast.error('Could not save preferences');
    }
    setSubmitting(false);
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-dark text-center mb-2">Roommate Compatibility Quiz</h1>
      <p className="text-gray-500 text-center mb-8">Answer a few quick questions so we can match you with compatible roommates.</p>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <motion.div
          className="bg-primary-500 h-2 rounded-full"
          animate={{ width: progress + '%' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-8 text-center"
      >
        <div className="text-4xl text-primary-500 mb-4 flex justify-center">{current.icon}</div>
        <h2 className="font-display text-xl font-bold text-dark mb-6">{current.question}</h2>
        <div className="space-y-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={'w-full py-3 rounded-lg border font-medium transition ' +
                (answers[current.key] === opt.value
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-sm text-gray-500 disabled:opacity-30"
        >
          Back
        </button>
        <span className="text-xs text-gray-400">{step + 1} of {questions.length}</span>
        {step === questions.length - 1 && answers[current.key] && (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm">
            {submitting ? 'Saving...' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoommateQuiz;
