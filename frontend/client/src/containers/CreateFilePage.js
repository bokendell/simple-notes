import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, transcribeFile, summarizeFile } from 'features/files';
// import updateUser from 'features/user';
import { Navigate } from 'react-router-dom';
import { BlobProvider, PDFViewer, pdf } from '@react-pdf/renderer';
import PDFPreview from 'components/PDFPreview';
import Layout from 'components/Layout';

const CreateFilePage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const { loading, error } = useSelector((state) => state.file);
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [uploading, setUploading] = useState(false);
  const [transcribed, setTranscribed] = useState(null);
  const [summarized, setSummarized] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [font, setFont] = useState('Times-Roman');
  const [fontSizeTitle, setFontSizeTitle] = useState(18);
  const [fontSizeSubHeading, setFontSizeSubHeading] = useState(14);
  const [fontSizeBody, setFontSizeBody] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.0);
  const [margin, setMargin] = useState(1.0);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [bodyColor, setBodyColor] = useState('black');
  const [title, setTitle] = useState('Factors that Enhance Learning');
  const [vocabulary, setVocabulary] = useState([
    {
      Term: 'Active Recall',
      Definition: 'Recalling information actively from memory',
      Example: 'Recalling answers to questions without looking at the textbook'
    },
    {
      Term: 'Interleaved Practice',
      Definition: 'Mixing different topics or subjects during study sessions',
      Example: 'Studying math problems, then switching to history, and then back to math'
    },
    {
      Term: 'Spacing Effect',
      Definition: 'Distributing study sessions over time for better retention',
      Example: 'Studying a language for 30 minutes every day instead of 3 hours once a week'
    }
  ]);
  const [summaryType, setSummaryType] = useState({
    '1': 'Active recall involves actively retrieving information from memory.',
    '2': 'Interleaved practice is the practice of mixing different topics or subjects during study sessions.',
    '3': 'The spacing effect suggests that spacing study sessions over time improves retention.'
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxAllowedSize = 70 * 1024 * 1024; // 70 MB

    if (file && file.size > maxAllowedSize) {
      alert('File is too large. Please keep audio to under an hour (70mb limit)');
      e.target.value = '';
      return;
    }
    else if (file) {
      setFile(file);
      setFileName(file.name);
    }
  }

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  }

  const handleNewFileNameChange = (e) => {
    setNewFileName(e.target.value);
  }

  const handleFontChange = (e) => {
    setFont(e.target.value);
  }

  const handleFontSizeTitleChange = (e) => {
    setFontSizeTitle(e.target.value);
  }

  const handleFontSizeSubHeadingChange = (e) => {
    setFontSizeSubHeading(e.target.value);
  }

  const handleFontSizeBodyChange = (e) => {
    setFontSizeBody(e.target.value);
  }

  const handleLineSpacingChange = (e) => {
    setLineSpacing(e.target.value);
  }

  const handleMarginChange = (e) => {
    setMargin(e.target.value);
  }

  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
  }

  const handleBodyColorChange = (e) => {
    setBodyColor(e.target.value);
  }

  // useEffect(() => {
  //   getDownloadLink();
  // }, [fileName]);

  useEffect(() => {
    console.log("transcription", transcription);
  }, [transcription]);

  useEffect(() => {
    if (transcribed) {
      // Perform actions when transcribed is true
    }
  }, [transcribed]);

  useEffect(() => {
    if (summarized) {
      // Perform actions when summarized is true
    }
  }, [summarized]);

  useEffect(() => {
    const getSummary = async () => {
      const prompt = `I am writing an application that summarizes lecture transcriptions to get summaries of lectures. Please return a summary in strict JSON format with the following structure:
      {
        "Title": "The main idea of the lecture",
        "Vocabulary": [
          {
            "Term": "The term",
            "Definition": "The definition of the term",
            "Example": "An example usage of the term"
          },
          // More vocabulary items...
        ],
        "Summary": [
          "The first key point or idea from the lecture.",
          "The second key point or idea from the lecture.",
          // More summary points...
        ]
      }
      DO NOT WRAP THE GENERATED JSON AS A CODE BLOCK. ONLY THE TEXT ITSELF SHOULD BE SENT.
      IF THERE ARE ANY ERRORS, STILL SEND THE FORMAT ABOVE, WITH RANDOM TEXT AND AN ERROR MESSAGE IN THE TITLE FIELD.
      DO NOT SEND ANY OTHER TEXT BESIDES THE STRICT JSON FORMAT ABOVE. Here is the lecture transcription: `;

      if (transcription) {
        setTranscribed(true);
        const summarizeResponse = await dispatch(summarizeFile({transcription: transcription, intro: prompt}));

  
        if (summarizeResponse.payload) {
          // await dispatch(updateUser({transcriptions_left: user.transcriptions_left - 1, transcriptions_made: user.transcriptions_made + 1}));
          setSummarized(true);
          setTitle(summarizeResponse.payload.Title);
          setVocabulary(summarizeResponse.payload.Vocabulary);
          setSummaryType(summarizeResponse.payload.Summary);
        }
      }
    };
  
    getSummary();
  }, [transcription, dispatch]); // Run this effect when `transcription` changes
  

  const pdfExport = useRef(null);

  if (!isAuthenticated && !loading && user === null)
		return <Navigate to='/login' />;

  const getDocument = () => {
    return <PDFPreview
    title = {title}
    vocabulary = {vocabulary}
    summary = {summaryType}
    font={font}
    fontSizeTitle={fontSizeTitle}
    fontSizeSubHeading={fontSizeSubHeading}
    fontSizeBody={fontSizeBody}
    lineSpacing={lineSpacing}
    margin={margin}
    backgroundColor={backgroundColor}
    bodyColor={bodyColor}
    />
  }

  const generatePdfBlob = async () => {
    const document = getDocument(); // Your method that returns the document definition
    const blob = await pdf(document).toBlob();
    return blob;
  };

  
  const downloadPdf = async () => {
    const blob = await generatePdfBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${newFileName || 'document'}.pdf`); // Default name if newFileName is empty
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    URL.revokeObjectURL(url); // Clean up to avoid memory leaks
  };
  

  const handleUploadFile = async () => {
    setUploading(true);
  
    try {
      const pdfBlob = await generatePdfBlob(); // Generate the PDF blob directly
      if (pdfBlob) {
        const formData = new FormData();
        formData.append('file', new File([pdfBlob], `${newFileName}.pdf`, {
          type: 'application/pdf',
        }));
  
        // Proceed with upload using formData
        const uploadResponse = await dispatch(uploadFile({ formData }));
        if (uploadFile.fulfilled.match(uploadResponse)) {
          // Handle successful upload
        } else {
          // Handle upload failure
        }
      } else {
        console.log('Failed to generate PDF blob.');
      }
    } catch (error) {
      console.error('Error generating or uploading PDF:', error);
    } finally {
      setUploading(false);
    }
  };
  


  
const handleSubmit = async (event) => {
  event.preventDefault();
  if (file && fileName) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mimetype', file.type);
      
      // const transcriptionResponse = `Alright. This is cs50's introduction to programming with Python. My name is David Malin, and this is our week on functions and variables. But odds are many of you most of you have never actually programmed before, so let's start by doing just that. Let me go ahead here and open up my computer and on it a program called studio code or Versus code, which is just a very popular program nowadays for actually writing code. Now, you don't have to write code using this particular tool. In fact, all we need at the today is a, a so called text editor, a program for writing text. And heck, if you really want, you could even use something like Google Docs or Microsoft Word. You'd have to save it in the right format, but really, at the end of the day, all you need is a program for writing text because that's what code is text. Now within this particular program, I'm gonna have the ability create 1 or more files via this top portion of the screen. And I'm gonna do so by diving right in and doing this at the bottom of my screen. At the bottom of my screen is a so called terminal window, and this is a command line interface or CLI interface to the underlying computer, be it your Mac or your PC or even some server in the cloud. And what I'm going to do here is literally write code and then the name of the file that I want to code, for instance, hello dot py, as we'll soon see, any program that you write in Python generally has a file named ends in dot py to indicate to the computer that it's indeed a program written in Python. Now you'll see here at the top of my screen, I have a blinking cursor, a line 1, which is the very first line of my code is gonna go, and then just a tab that reminds me of the name of this file, hello dot py. And without even knowing much Python, I'm gonna write my very first program here as follows. Print, open parenthesis, quote, hello, comma, world, close quote, and close parenthesis. And you'll see that at my keyboard, some of my thoughts were finished for me. I only had to type 1 and the other one automatically appeared, and that's just a feature that we'll see of tools like this tool here. Now, even if you've never programmed before, odds are you can guess infer what this simple program is going to do, and it's only one line. Print, open parenthesis, quote, hello, world, close quote, closed parenthesis. Indeed, when I run this program, ultimately, it's just gonna say hello to the world. And in fact, this is a very famous, perhaps the most canonical program that you can write as your very 1st program in Python or any other language, and so that's what I've done here. But on my Mac, my PC see, even my phone, I'm generally in a habit like you, of running programs by double clicking an icon or just tapping on the screen, but I see no such icons here. And in fact, that's because is my interface to at least my current Mac or PC or some server in the cloud is again only a CLI command line interface which even though it might feel like it's a step back from the menus and buttons and icons that you and I take for granted every day, you'll find, we think, that it's ultimately a much more powerful interface and incredibly popular to use among programmers in the real world. So to run this program, I'm gonna have to use a command And I'm gonna move my cursor back down to the bottom of the screen here where previously I already ran one command. The command code, which has the effect of opening v s code in my computer, and then I passed in Now the dollar sign here doesn't indicate any kind of currency or money. It just is the symbol that's generally used to indicate your prompt, where the command line interface wants you to put those commands. Now the command I can run here is going to be this. I'm gonna run Python of hello dot py. Now why is that? Well, it turns out that when I actually write code in a language like Python, it's, of course, stored in that file, hello dot py, but I need to interpret the code top to bottom left to right so that the computer knows what to do. Indeed, at the end of the day, even if you don't really know much about computer, you've probably heard that computers only understand 0s and 1, the so called binary system. Well, if that's the case, then something that says print, and parenthesis, and, quote, unquote, hello world is not surely zeros and ones. We have to somehow translate it into the zeros and ones computer understands. Now fortunately, so long as you've installed such a program in advance, there's called Python. So Python is not only a language in which we're going to write code, it's also a program. Otherwise, known as an interpreter, that you install for free on your own Mac or PC or some server in the cloud, and you can then run that program that interpreter passing to it as input, the name of your file, like mine here, hello dot py, and then that program, that interpreter will handle the process of reading it top to bottom left to right, and translating it effectively into those zeros and ones that the computer can understand. So let's do just that. Let me go back to v s co here, I already typed out Python of hello dot pi, but I didn't yet hit enter, and that's what's now gonna kick off this command. And hopefully, If I didn't mess any of this up, I should see my very first program's output to the screen. And voila, Hello, world. So if you 2 have typed exactly that same code and have ex executed exactly that same command, you will have written your very first program, in this case, in Python. Well, now let's take a step back and consider what is it that we actually just did, and what is it we're looking here on the screen? Well, 1st and foremost, most any programming language, you tend to have access to what are called functions. A function is like an action or a verb that lets you do something in the program program. And generally speaking, any language comes with some predetermined set of functions, some very basic actions or verbs that the computer will already know how to do for you, that the language really will know how to do for you, and you, the programmer, the human, can use those functions at will to get the computer to do those things. Now the programming question here, hello.pie, is using one function. You can perhaps guess what it is. That function is of course going to be this function print, and that print function, of course, doesn't print some preordained string of text. That is to say it prints whatever it is you want it to print. And here too, do we have another piece of terminology in the world of programming, namely arguments. An argument is an input to a function that somehow influences behavior. The people who invented Python, of course, didn't necessarily know what it is you and I are going to want to print to the screen, so they designed this print function using these parentheses, with the ability to take as input some string of text, be it in English or any other human language that is what you want this function, ultimately, to print onto the screen. And what is it that the program's ultimately doing on the screen? Well, it's printing, of course. It showing us hello world on the screen, and that's generally in programming known as a side effect. It can be visual. It can be audio. In this case, it's something that appears on the screen. And functions, therefore, can indeed have these side effects. One of the things they can do as this verb or action is to display on the screen as a side effect, some like those world words that we wanted, hello, world. So that's my first program, and, you know, I'm feeling pretty good. Everything worked as planned. I didn't make any mistakes, but honestly, when you're learning how to program and even once you've learned how to program years later, you're going to make mistakes. Those mistakes, of course, are referred to a term you might already know, which is that of a bug. A bug is a mistake in a program, and they can take so many forms and take comfort, perhaps, in knowing that over the coming weeks, you're gonna make so many mistakes. You're gonna have many bugs in your code just like I did, and just as I still do, and those bugs themselves are just mistakes that are problems for you to solve. And over the weeks to come, we're going to give you a lot of tools, both mental and technical, via which you can solve those problems, but just don't get discouraged if when fighting your program for the first time. It doesn't even work that first time. It will, with time, with practice, and with experience. So let me deliberately now make a mistake that there was a non chance I might have done accidentally already, but I got lucky. Let me go ahead and just suppose I forgot to include something like the closing parenthesis at the end of this line of code. You know, the code is almost correct. It's like 99% of the way there, but now that I've pointed it out, it's pretty obvious that it's missing that closed parenthesis, but even little, seemingly minor details like that, that you and I as humans wouldn't really care about. And if you're sending an email or a text message, I'll whatever, it's just a type it's not that big a deal. It is gonna be a big deal to the computer. A computer is gonna take you literally, and if you don't finish your thought in the way the language expects, it's not gonna necessarily run at all. So let's do this. I'm gonna go ahead here and clear my screen down at the bottom just so I can start fresh, and I'm gonna go ahead run this version of my program after having made that change by deleting the parenthesis. I'm gonna go ahead and type Python again of hello dot py, and this time when I hit enter, I'm hoping I'm gonna see hello world, but here we have an error on the screen, a so called syntax error, which refers to My having made a mistake at my keyboard, and it this one fortunately is pretty straightforward. It indeed says that this open parenthesis was never closed and So that's probably pretty intuitive now what I need to do. I need of course to close it. Unfortunately, sometimes the error messages we'll see in the coming weeks not going to be nearly that user friendly, but there, too, again, with experience with practice, will you get better at debugging such programs. Let me now make sure that I indeed fixed it correctly. Let me go ahead, run. Now, hello dot pie and hit enter, and voila, we're back in business. Well, let me pause here and see if we have any questions now about Python itself, writing, or running, even the simplest of these programs. Could I write code inside a word or, for example, Microsoft Excel and what's the barrier to doing that? A really good question and allow me to very explicitly say to the entire internet that you should not write code Microsoft Word. I mentioned that only because it's a tool via which you can write text and code is at the end of the day just text, but it's not the right tool for the job. We don't need both facing, underlining paragraphs and the like, we generally want something much simpler than Microsoft Word or Google Docs. And so Versus code is an example of just a more general purpose text editor. Its purpose in life is to allow you the human to edit text. Nowadays, these text editors come with many more features In fact, you'll notice that even in my code here, even though it's just one line, there's a bit of color to it. The word print for me is appearing in blue. The print Caesar black, and we'll see as we might write more lines of code more and more of the lines will come to life in various colors. Now, that's just one feature of a text editor we'll too that it has features like this built in terminal window. It's gonna have a built in tool for debugging or finding problems with code, and it's just a very popular tool nowadays. There are many, many others out there. You're welcome to use them for this course and beyond. We just happen to use this one in large part 2 because you can also use Versus code nowadays, for free in the cloud. How about one other question here on programming with Python or hello world or syntax more generally? Well, I was trying to ask if It is not possible to run the computer using the terminal window. I think I heard is it not if it's possible to run the program without the terminal window? Are you Yes, sir. Okay. You froze for me again, but let me infer what the question is. So in this environment, as I've configured my computer, I can only run these Python programs via the terminal window. Now, that's good for me. The programmer or the person who's trying to learn how to program but it's not very good if you want to ship this software and have other people use your actual code. You can absolutely write programs and then allow other people to use, not a command line interface, but a graphical user interface, or GUI, GUI. This is just one mechanism, and perhaps I think the, the best one with which to start writing code, because eventually, it's going to give us a lot more control. Allow me to forge ahead here, but please feel free to continue asking questions along the way if only via the chat, and let's consider now how we might go about improving this program. Let's go about improving this program to make it a little more interactive and not just assume that everyone is going to want to be greeted more generically as Hello World. Let's see if I can't get this program to say something like hello, David, hello Jeremiah or hello Horatio or whatever the actual user's name is. Well, to do this, I'm gonna go back up to hello dot py I'm gonna add another line of code at the very top that simply says, for instance, what's your name, quote, un quote, with an extra space at the end. So I'm printing to the user, asking them a question for some input, but now I need another function to actually get input from the user. And perfectly. Enough Python comes with a function named input. So here, I'm gonna go ahead and call a function, input, open and that's going to prompt the user with just a blinking cursor waiting for them to type something in. Now it turns out if I read the documentation for the input function, It actually takes an argument itself. I don't need to use print separately and then prompt the user for input, so I can actually simply. And get rid of the print altogether. And in fact, that print would have added a new line anyway. So now I've just got a prompt where the user's cursor's gonna end up blinking end of the line asking them, what's your name? In my terminal window, I'm gonna run Python of hello dot py enter. Okay. We're making progress. It seems that this new function input is indeed prompting me the human for input, so I'm going to type in my name, David, and hit enter Unfortunately, it doesn't really do anything with my name. It just outputs it immediately. Alright. Well, I could fix this, right? I could go up to line 2 and I could change world David, and then back in my terminal window here, I can do Python of hello dot py, enter. What's your name? David, enter, and there we go. Alright. Now I'm up and running. Now my program is working as intended. Of course, This isn't really working as intended here. Let me go ahead and try pretending to be my colleague Carter here. Well, Carter's name is this. I'm gonna go ahead it enter, and I'll see, of course, hello Carter will obviously not because I've hard coded, so to speak. I've written literally my name inside of the string. So we need some way now of actually getting back what the user's input is and doing something with it, ultimately. And for this, we're gonna leverage another feature of programming, specifically a feature of some functions, which that they can have return values as well. If you think of input as being, again, this action, this verb, you can actually personify it as maybe a person, like a friend of yours that you asked a question of, and you've asked your friend to go get input from someone else. Go ask that person their name. And if your friend comes back knowing that person's name, Well, wouldn't it be nice if they handed that name back to you? That's kind of what we need metaphorically the function to do is get the user's input and then hand it back to me so that I, the programmer, can do something with it. But if it's going to be handed back to me, I kinda want to put it somewhere so that I can then print it back on the screen. I need to do the equivalent of take out, like, a piece of paper or post it note, write down on this piece of paper what it is the human has said so that I can then feed it into as input that print function. And to do that, we're gonna need 1 more feature of programming, namely variables, And odds are almost everyone's familiar with variables from math class way back when, X, and Y, and Z, and the like, while programming has that same capability. This ability to create a variable, in this case, in the computer's memory, not just on a piece of paper, and that variable can store a value, a number some text, even an image or video or more, a variable is just a container for some variable. Variable is just a container for some value inside of a computer or inside of your own program. So how do I go about expressing myself in this way? Well, I think what I'm gonna do is introduce a variable that's a little more interestingly named than x or y. I I could just say this, x equals input, but I'm gonna use a better name than a typical mathematical variable here, and I'm gonna literally call my variable name. Why? Well, in programming, because I have keyboard in front of me, I can use more descriptive terms to describe what it is I'm writing. And now, though, there's an opportunity to consider a specific piece of syntax, we've seen parentheses We've seen quotes, all of which are necessary when passing inputs to a function, but this equal sign here that's in between input on the right and name on the left is actually important, and it's technically not an equal sign per se. It doesn't mean equality as much as it assignment. So in Python and many programming languages, a single equal sign is the assignment operator. And what that means specifically is that you want to assign from right to left, whatever the user's input is. So the equal sign copies from the right to the left, whatever the return value of the function on the right is. So again, the input function clearly gets input from the user. That's why I was able type my name or Carter's, but it also, sort of, behind the scenes, hands that value, that return value back to me the programmer. And if I use an equal sign and a variable, no matter what I call it, I can store that input in that variable so as to reuse it late So now sitting in the computer's memory somewhere is a container containing David, quote unquote, or Carter, quote unquote, or whatever the human has typed in. But here, it's easy to make a mistake. Suppose I decide to try to print that name And so I I kind of, on a hunch type in this, hello, comma, name, just kind of plugging in the name of the variable. Well, let me go ahead here and run Python of hello dot py and hit enter. That's gonna prompt me for my name, and let me type in my name, d a v I d, but I haven't hit enter yet. And perhaps via the chat, what's gonna happen here when I now hit enter? I'm hoping it says, hello, David, I'd be okay if it says hello world, but I don't want it to say what it's actually gonna say. And yep, what we're seeing in the chat is, well, it's probably gonna say, literally, hello, comma, name. So that's not quite right. So we need another way of printing out the value inside of that variable rather than just this word name. Well, let me try this in a couple of different ways. Let me try this as follows. Let me go ahead and maybe undo this because I've gotten pretty good already at saying hello. So let's, you know, let's draw that line in the sand and just say, alright, let's get, at least get hello, comma, out the door. Let's now print name and just on a hunch, I'm gonna try this. I'm gonna use print again, because you can use these functions as many times as you need, and I'm gonna pass to the name to the print function the variable called name. But notice I'm being a little clever now. I'm not putting it in double quotes because we've seen already that double quotes means literally print out m a m e I'm getting rid of the quotes this time in hopes that now by passing the variable called name to the function called print, it will in fact go about printing the contents of that variable that is its so called value. Alright. Let's go ahead and do this here. Python of hello dot py enter. What's your name, David, and now crossing my fingers still, I see hello, comma, David. Alright. So it's not the best program. I'm I'm kind of cutting some corners here, so to speak. I'm saying, hello, David, on 2 separate lines. So not as elegant, it's not as pretty, it's not as grammatically appropriate in English as just saying it all in one breath on one line, but at least I've solved the problem, just not very well yet. But let me take a step back now and perhaps introduce a couple of other concepts with which we should be familiar, which is as our programs get longer, and they're no longer just one line, or 2, or even 3. Eventually, our programs are gonna become dozens of lines, maybe even hundreds of lines long. Let's set the stage for SS moving forward. It turns out that Python and a lot of programming languages also support something called comments. Comments are notes to yourself in your code. And you include comments by way of a special symbol in Python, it's going to be the hash symbol, typically, and that allows you to write the equivalent of a note to yourself, but in a way that's not gonna break your code. The computer actually ignores your`;
      // setTranscription(transcriptionResponse);
      const transcriptionResponse = await dispatch(transcribeFile(formData));

      if (transcriptionResponse.payload) {
        setTranscription(transcriptionResponse.payload.results.channels[0].alternatives[0].transcript);
        // The transcription state will be updated, and useEffect will handle the rest
      }
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  }
};


  return (
    <Layout title='SimpleNotes | new note' content='Create File Page'>
      <h1>create a note</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">most audio formats accepted</label>
          <input className="form-control" type="file" accept='.mp3, .mp4, .mp2, .aac, .wav, .flac, .pcm, .mov, .m4a' id="formFile" onChange={handleFileChange} />
        </div>
        <h3>pdf settings</h3>
        <h4>font</h4>
        <div class="input-group mb-3">
          <label class="input-group-text" for="inputGroupSelect01">style</label>
          <select class="form-select" id="inputGroupSelect01" defaultValue={"Times-Roman"}onChange={handleFontChange} >
            <option selected>Choose...</option>
            <option value={"Times-Roman"}>Times New Roman</option>
            <option value={"Courier"}>Courier</option>
            <option value={"Helvetica"}>Helvetica</option>
            <option value={"OpenSans"}>Sans-Serif</option>
          </select>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">title</span>
          <input type='number' min={0} max={50} defaultValue={18} onChange={handleFontSizeTitleChange} className="form-control" placeholder="Title Font" aria-label="Title Font" aria-describedby="basic-addon1"></input>
          <span className="input-group-text" id="basic-addon1">headings</span>
          <input type='number' min={0} max={50} defaultValue={14} onChange={handleFontSizeSubHeadingChange} className="form-control" placeholder="Body Font" aria-label="Body Font" aria-describedby="basic-addon1"></input>
          <span className="input-group-text" id="basic-addon1">body</span>
          <input type='number' min={0} max={50} defaultValue={12} onChange={handleFontSizeBodyChange} className="form-control" placeholder="Body Font" aria-label="Body Font" aria-describedby="basic-addon1"></input>
        </div>
        <h4>spacing</h4>
        <div className="input-group mb-3">
        <label class="input-group-text" for="inputGroupSelect01">line</label>
          <select class="form-select" id="inputGroupSelect01" onChange={handleLineSpacingChange}>
            <option selected>Choose...</option>
            <option value="1.0">1.0</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2.0">2.0</option>
            <option value="2.5">2.5</option>
            <option value="3.0">3.0</option>
          </select>
          <label class="input-group-text" for="inputGroupSelect01">margin</label>
          <select class="form-select" id="inputGroupSelect01" onChange={handleMarginChange}>
            <option selected>Choose...</option>
            <option value="0.5">0.5</option>
            <option value="1.0">1.0</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
          </select>
        </div>
        <h4>color</h4>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">background</span>
          <input type="color" class="form-control form-control-color" onChange={handleBackgroundColorChange} id="background-color-input" defaultValue="white" title="Choose your color"></input>
          <span className="input-group-text" id="basic-addon1">body</span>
          <input type="color" class="form-control form-control-color" onChange={handleBodyColorChange} id="body-color-input" defaultValue="black" title="Choose your color"></input>
        </div>
        {/* <h5>transcriptions left: {user.transcriptions_left}</h5> */}
        <div className="d-grid gap-2">
          {(loading && transcribed == null) && 
          <div class="d-flex align-items-center">
            <strong class="text-primary" role="status">transcribing...</strong>
            <div class="spinner-border ms-auto text-primary" aria-hidden="true"></div>
          </div>}
          {(loading && transcribed != null && summarized == null) && 
          <div class="d-flex align-items-center">
            <strong class="text-primary" role="status">summarizing...</strong>
            <div class="spinner-border ms-auto text-primary" aria-hidden="true"></div>
          </div>}
          {error && 
          <div class="alert alert-danger" role="alert">
            <div>
              Error: {error}
            </div>
          </div>}
          {(!loading && !summarized) && 
          <button type="submit" className='btn btn-outline-primary' disabled={!file}>summarize</button>
          }
          {(!loading && summarized && transcribed) && (
          <div className="input-group mb-3">
            <span className="input-group-text">file name</span>
            <input
              type="text"
              placeholder="Enter file name to save"
              className="form-control"
              aria-label="file name"
              value={newFileName}
              onChange={handleNewFileNameChange}
            />
            {!uploading ? (
              <>
                <button type="button" className="btn btn-outline-primary" onClick={downloadPdf} disabled={!newFileName}>Download PDF</button>
                <button
                  onClick={handleUploadFile}
                  type="button"
                  className='btn btn-outline-primary'
                  disabled={!newFileName}
                >
                  Save to account
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-outline-primary" onClick={downloadPdf} disabled={!newFileName}>Download PDF</button>
                <button className='btn btn-outline-primary' disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Uploading...
                </button>
              </>
            )}
          </div>
        )}


        </div>
      </form>

      <h3>preview</h3>
      <PDFViewer style={{ width: '100%', height: '500px' }}>
        {getDocument()}
      </PDFViewer>
    </Layout>
  );
};

export default CreateFilePage;