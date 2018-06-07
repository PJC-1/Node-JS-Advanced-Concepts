

Advanced Node Concepts
===================
> Learning about Node.js

Threads
-------------
>*What are threads?*
>
>When ever you run **programs** on a computer, something called a **process** is started up.
>
>A **process** is an instance of a computer program that is being executed.
>
>Within a single process, we can have **multiple** things called **threads**.
>
>You can think of a **thread** as a type of **to-do list**, that has some number of instructions that need to be executed by the **cpu** of you computer.
>
>The **thread** is given to the **cpu**, and the **cpu** will attempt to **run** every instruction on it, **one by one**.
>
>A **single process** can have **multiple threads** inside of it.
>
>An important aspect of **threads** are **scheduling**, which refers to you **operating system's** ability to decide which **thread** to process at any given instance in time.
>
>You need to remember that your computer has a *limited* amount of resources available to it and your **cpu** can only process so many *instructions* per *second*.
>
>This starts to become very relevant when we start to get many active **processes** and **threads** on our computer.
>
>The **operating systems scheduler** has to look at the different **threads** that are asking to be processed, and figure out how to do some amount of work on each of them while making sure that they don't have to wait too long to be processed.
>
>We want to make sure that *urgent threads* don't have to wait too long to be executed.
>
>There are a couple different strategies that are used to improve the rate at which these threads can be processed.
>
>The first being: *Adding more CPU Cores to our machine.*, if we have more than one core inside of our  **CPU** then we can easily process multiple threads at the same time.
>
>The second is: *Closely examine the work that is being done by each thread and allow our operating system scheduler to detect big pauses in processing time due to expensive input and output operations*
>
>*what is the event loop?*
>
>When we start up a node program on our computer, node automatically creates one **thread** and then executes all of our code *inside* of that one single thread.
>
>Inside that single thread is something called the **event loop**, you can think of the **event loop** as being like a *control structure* that decides what our one thread should be doing at any given point in time.
>
>This event loop is the absolute core of every program that you and I run and every program that you and I run has exactly **one** event loop.
>
>Understanding how the event loop works is *extremely* important because a lot of performance concerns about node eventually boil down to how the event loop behaves.
>
>**fake code example to illustrate the event loop process**
>
>```
>// node myFile.js
>
>const pendingTimers = [];
>const pendingOSTasks = [];
>const pendingOperations = [];
>
>// New timers, tasks, operations are recorded from myFile running
>myFile.runContents();
>
>function shouldContinue() {
>  // Check one: Any pending setTimeout, setInterval, setImmediate?
>  // Check two: Any pending OS tasks? (Like server listening to port)
>  // Check three: Any pending long running operations? (Like fs module)
>  return pendingTimers.length || pendingOSTasks.length || pendingOperations;
>}
>
>// Entire body executes in one 'tick'
>while(shouldContinue()) {
>  // 1) Node looks at pendingTimers and sees if any functions
>  // are ready to be called. setTimeout, setInterval
>
>  // 2) Node looks at pendingOSTasks and pendingOperations
>  // and calls relevant callbacks
>
>  // 3) Pause execution. Continue when...
>  //  - a new pendingOSTasks is done
>  //  - a new pendingOperation is done
>  //  - a timer is about to complete
>
>  // 4) Look at pendingTimers. Call any setImmediate
>
>  // 5) Handle any 'close' events
>}
>
>// exit back to terminal
>
>```
>
>For *some* **standard library* function calls the node C++ side and *libuv* decide to do expensive calculations outside of the event loop entirely.
>
>They make use of something called a **thread pool**, the **thread pool** is a series of four *threads* that can be used for running computationally intensive tasks.
>
>By default *libuv* creates *4* *threads* in this **thread pool**, which means that in addition to the *thread* used for the **event loop** there are **4** other *threads* that can be used to *offload* expensive calculations that need to occur inside of our application.
>
>Many of the functions included in the node *standard library* will automatically make use of this *thread pool*.
>
>**Example Code illustrating the use of the Thread Pool**:
>```
>const crypto = require('crypto');
>
>const start = Date.now();
>
>crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>  console.log('1:', Date.now() - start);
>});
>
>crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>  console.log('2:', Date.now() - start);
>});
>
>crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>  console.log('3:', Date.now() - start);
>});
>
>crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>  console.log('4:', Date.now() - start);
>});
>
>crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>  console.log('5:', Date.now() - start);
>});
>
>```
>
>**Example Output**:
>```
>$ node threads.js
>4: 1015
>2: 1060
>3: 1069
>1: 1090
>5: 1819
>```
>
>- The first **4** calls took ```~1``` second to complete and the **5th** call took ```~2``` seconds.
>- The first **4** calls each got offloaded to one **thread** that existed inside the **thread pool**.  Once the **4** threads were done processing, *node* was able to more on to the **5th** function call.
>
