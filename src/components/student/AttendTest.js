import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

// Mock function to simulate fetching test content from an API
const fetchTestContent = async (courseId, testId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'Programming Aptitude Test',
        questions: [
          {
            type: 'mcq',
            question: 'What is the time complexity of Quick Sort?',
            options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(n log n)'],
          },
          {
            type: 'paragraph',
            question: 'Explain the concept of closure in JavaScript.',
          },
          {
            type: 'coding',
            question: 'Write a function to reverse a string in Python.',
          },
        ],
      });
    }, 1000);
  });
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .05)',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .05)',
  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  '&:hover': {
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: theme.spacing(1, 4),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
  },
}));

const AttendTest = () => {
  const { courseId, testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [testContent, setTestContent] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const getTestContent = async () => {
      setLoading(true);
      const content = await fetchTestContent(courseId, testId);
      setTestContent(content);
      setLoading(false);
    };

    getTestContent();
  }, [courseId, testId]);

  const handleAnswerChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    console.log(`Answers submitted for Course ID: ${courseId}, Test ID: ${testId}:`, answers);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading test content...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          {testContent.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom align="center">
          Course ID: {courseId} | Test ID: {testId}
        </Typography>
        <StyledPaper elevation={3}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {testContent.questions.map((_, index) => (
              <Step key={index}>
                <StepLabel>Question {index + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <QuestionCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Question {activeStep + 1}:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {testContent.questions[activeStep].question}
              </Typography>
              {testContent.questions[activeStep].type === 'mcq' && (
                <RadioGroup
                  value={answers[activeStep] || ''}
                  onChange={(e) => handleAnswerChange(activeStep, e.target.value)}
                >
                  {testContent.questions[activeStep].options.map((option, i) => (
                    <FormControlLabel
                      key={i}
                      value={option}
                      control={<Radio color="primary" />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              )}
              {(testContent.questions[activeStep].type === 'paragraph' ||
                testContent.questions[activeStep].type === 'coding') && (
                <TextField
                  label="Your Answer"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={testContent.questions[activeStep].type === 'coding' ? 6 : 4}
                  value={answers[activeStep] || ''}
                  onChange={(e) => handleAnswerChange(activeStep, e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </CardContent>
          </QuestionCard>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <StyledButton
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </StyledButton>
            <StyledButton
              onClick={activeStep === testContent.questions.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === testContent.questions.length - 1 ? 'Submit' : 'Next'}
            </StyledButton>
          </Box>
        </StyledPaper>
        <LinearProgress 
          variant="determinate" 
          value={(activeStep / (testContent.questions.length - 1)) * 100} 
          sx={{ mt: 4, height: 10, borderRadius: 5 }}
        />
      </Box>
    </Container>
  );
};

export default AttendTest;
