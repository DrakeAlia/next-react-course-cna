import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

// Answer component takes in an id prop and returns a label with an input for the answer and a checkbox for whether the answer is correct.
function Answer({ id }: { id: number }) {
  return (
    <label>
      Answer {id}:
      <input
        className="bg-gray-500 border-2 border-gray-50 hover:bg-blue-400 p-1 rounded w-full"
        type="text"
        name={`answer-${id}`}
      />
      <input type="checkbox" name={`check-${id}`} />
    </label>
  );
}
// QuizForm component returns a form that takes in a FormData object as an argument.
// FormData is a built-in JavaScript object that contains the data from the form.
// The form has a title, description, question, and three answers.
// The answers are generated using the Answer component.
// The form has a submit button that calls the createQuiz function when clicked.
// createQuiz function takes in a FormData object as an argument.
// createQuiz function gets the data from the form using the FormData object.
// createQuiz function inserts the data from the form into the database.
// createQuiz function redirects the user to the home page.
export default function QuizForm() {
  async function createQuiz(formData: FormData) {
    "use server";
    let title = formData.get("title") as string;
    let description = formData.get("description") as string;
    let question = formData.get("question") as string;
    let answers = [1, 2, 3].map((id) => {
      return {
        answer: formData.get(`answer-${id}`) as string,
        isCorrect: formData.get(`check-${id}`) === "on",
      };
    });

    // console.log({ title, description, question, answers });
    
    await sql`
        WITH new_quiz AS (
            INSERT INTO quizzes (title, description, question_text, 
            created_at)
            VALUES (${title}, ${description}, ${question}, NOW())
            RETURNING quiz_id
        )
        INSERT INTO answers (quiz_id, answer_text, is_correct)
        VALUES
            ( (SELECT quiz_id FROM new_quiz), ${answers[0].answer}, 
            ${answers[0].isCorrect}),
            ( (SELECT quiz_id FROM new_quiz), ${answers[1].answer}, 
            ${answers[1].isCorrect}),
            ( (SELECT quiz_id FROM new_quiz), ${answers[2].answer}, 
            ${answers[2].isCorrect})
    `;
    // WITH is a keyword used to create a temporary table.
    // new_quiz is the name of the temporary table.
    // INSERT INTO is the keyword used to insert data into a table. In this case, we are inserting data into the quizzes table.
    // title, description, question, and answers are the data we are inserting into the quizzes table.
    // RETURNING is a keyword used to return the data that was inserted into the table.
    // quiz_id is the column we are returning.
    // revalidatePath function is used to revalidate the home page. Meaning, the home page will be regenerated with the new quiz.
    revalidatePath("/");
  }

  return (
    <form className="flex flex-col p-2 mt-8 max-w-xs" action={createQuiz}>
      <h3 className="text-lg font-bold text-center">Create Quiz</h3>
      <label className="mt-2">
        Title:
        <input
          className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-400 rounded p-1 mt-2 w-full"
          type="text"
          name="title"
        />
      </label>
      <label className="mt-2">
        Description:
        <input
          className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-400 rounded p-1 mt-2 w-full"
          type="text"
          name="description"
        />
      </label>
      <label className="mt-2">
        Question:
        <input
          className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-400 rounded p-1 mt-2 w-full"
          type="text"
          name="question"
        />
      </label>
      <div className="my-4" />
      <Answer id={1} />
      <Answer id={2} />
      <Answer id={3} />
      <button
        type="submit"
        className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-700 rounded p-2 mt-4 w-full transition-all"
      >
        Create Quiz
      </button>
    </form>
  );
}
