import * as React from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  VerbTenses,
  VerbQuiz,
  createDefaultVerbQuiz,
} from './test-fill-gap.vm';
import { Formik, Form } from 'formik';
import { GapComponent } from './components';
import { ShowResults } from 'common/components/show-results';
import { Verb, VerbCorrect, createDefaultVerbCorrect } from 'common/model';
import { answerIsCorrect } from './test-fill-gap.business';
import * as styles from 'common/styles/tests.styles';
import { Pronunciation, TestsNavbar } from 'common/components';

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  verb: Verb;
  score: number;
  setScore: (value: number) => void;
}

export const TestFillGapComponent: React.FC<Props> = props => {
  const {
    currentQuestion,
    totalQuestions,
    onNextQuestion,
    verb,
    score,
    setScore,
  } = props;

  const [verbCorrect, setVerbCorrect] = React.useState<VerbCorrect>(
    createDefaultVerbCorrect()
  );
  const [validated, setValidated] = React.useState(false);

  const [initialQuiz, setInitialQuiz] = React.useState<VerbQuiz>(
    createDefaultVerbQuiz()
  );

  const {
    title,
    mainContainer,
    inputContainer,
    backContainer,
    pictureContainer,
    picture,
    insideBtnContainer,
    nextBtn,
    arrowIcon,
  } = styles;

  const handleValidateAnswer = (verbCorrection: VerbCorrect) => {
    if (verbCorrection.all) {
      setScore(score + 1);
    }
    setVerbCorrect(verbCorrection);
    setValidated(true);
  };

  const internalHandleOnNextQuestion = () => {
    setValidated(false);
    onNextQuestion();
  };

  const textToSpeech = (): string => {
    if (verb.infinitive === 'read') {
      // Workaround for 'to read', using homophones
      return 'reed. red. red';
    }
    return `${verb.infinitive}. ${verb.past}. ${verb.participle}`;
  };

  return (
    <main className={mainContainer}>
      <TestsNavbar score={score} currentQuestion={currentQuestion} />
      <h1 className={title}>
        {verb.translation} ({`${currentQuestion} / ${totalQuestions}`})
      </h1>
      <Formik
        onSubmit={(values, actions) => {
          const isCorrect = answerIsCorrect(verb, values);
          handleValidateAnswer(isCorrect);
          const reset = createDefaultVerbQuiz();
          actions.resetForm({ values: reset });
          setInitialQuiz(reset);
        }}
        initialValues={initialQuiz}
      >
        {() => (
          <Form>
            {!validated && (
              <div className={backContainer}>
                <div className={pictureContainer}>
                  <img
                    className={picture}
                    src={`/assets/verb-images/${verb.infinitive}.png`}
                  />
                </div>
                <div className={inputContainer}>
                  <GapComponent
                    isGap={initialQuiz.tense === VerbTenses.infinitive}
                    text={verb.infinitive}
                    tense={'Infinitive'}
                  />
                  <GapComponent
                    isGap={initialQuiz.tense === VerbTenses.past}
                    text={verb.past}
                    tense={'Past'}
                  />
                  <GapComponent
                    isGap={initialQuiz.tense === VerbTenses.participle}
                    text={verb.participle}
                    tense={'Participle'}
                  />
                </div>
                <Pronunciation text={textToSpeech()} />
              </div>
            )}
            {validated ? (
              <>
                <ShowResults
                  secondAttemptEnabled={false}
                  isSecondAttempt={false}
                  verbCorrect={verbCorrect}
                  verb={verb}
                />

                <Button
                  className={nextBtn}
                  onClick={internalHandleOnNextQuestion}
                  variant="contained"
                >
                  <div className={insideBtnContainer}>
                    <span>Next Verb</span>
                    <ArrowForwardIcon className={arrowIcon} />
                  </div>
                </Button>
              </>
            ) : (
              <Button
                className={nextBtn}
                type="submit"
                variant="contained"
                disableElevation
              >
                <div className={insideBtnContainer}>
                  Next <ArrowForwardIcon className={arrowIcon} />
                </div>
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </main>
  );
};
