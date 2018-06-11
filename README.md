
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
>*is the event loop single threaded?*
>
>The node *event loop* is single threaded, but some of the functions that included inside of the node *standard library* are run outside of the event, and outside of that single thread (not single threaded).
>
>Basically, the event loop uses a single thread but a lot of the code that you and I write does not actually execute inside that thread entirely.
>
>**Questions about threadpools?**
>
>Q: *Can we use the threadpool for javascript code or can only nodeJS functions use it?*
>A: We can write custom JS that uses the thread pool.
>
>Q: *What functions in node std library use the threadpool?*
>A: All 'fs' module functions. Some crypto stuff. Depends on OS (windows vs unix based).
>
>Q: *How does this threadpool stuff fit into the event loop?*
>A: Tasks running in the threadpool are the 'pendingOperations' in our code example.
>
>**Questions about OS Async features?**
>
>Q: *What functions in node std library use the OS's async features?*
>A:  Almost everything around networking for all OS's. Some other stuff is OS specific.
>
>Q: *How does this OS async stuff fit into the event loop?*
>A: Tasks using the underlying OS are reflected in our 'pendingOSTasks' array.
>
>**Interesting Threadpool Example**
>
>**Example Code**:
>```
>const https = require('https');
>const crypto = require('crypto');
>const fs = require('fs');
>
>const start = Date.now();
>
>function doRequest() {
>  https
>  .request('https://www.google.com', res => {
>    res.on('data', () => {});
>    res.on('end', () => {
>      console.log(Date.now() - start);
>    });
>  })
>  .end();
>}
>
>function doHash() {
>  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>    console.log('Hash:', Date.now() - start);
>  });
>}
>
>doRequest();
>
>fs.readFile('multitask.js', 'utf8', () => {
>  console.log('FS:', Date.now() - start);
>});
>
>doHash();
>doHash();
>doHash();
>doHash();
>
>```
>
>**Example Output**:
>```
>$ node multitask.js
>311
>Hash: 1877
>FS: 1878
>Hash: 1888
>Hash: 1891
>Hash: 1901
>```
>
>**Output Explination**:
>- First we see the benchmark from the ```http``` module.
>- Then we see one console log from the hashing function.
>- After we see the ```file system``` module call.
>- Then we see the ```3``` remaining hashing function calls.
>
>- There is no way that reading a file off of the hard drive can possibly take ```2``` seconds.
>- If you comment out all of the hashing function calls and run the file.
>**Example Code**:
>```
>const https = require('https');
>const crypto = require('crypto');
>const fs = require('fs');
>
>const start = Date.now();
>
>function doRequest() {
>  https
>  .request('https://www.google.com', res => {
>    res.on('data', () => {});
>    res.on('end', () => {
>      console.log(Date.now() - start);
>    });
>  })
>  .end();
>}
>
>function doHash() {
>  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
>    console.log('Hash:', Date.now() - start);
>  });
>}
>
>doRequest();
>
>fs.readFile('multitask.js', 'utf8', () => {
>  console.log('FS:', Date.now() - start);
>});
>```
>
>**Example Output**:
>```
>$ node multitask.js
>FS: 19
>185
>```
>
>- It takes ```19``` milliseconds to complete reading off the harddrive, this means that we are seeing some very intersting behavior in the implementation with the hashing function calls since it's taking ```~2``` seconds to complete the ```file system``` read method.
>
>**Why do we always see exactly one hash console log before the result of the file system?**
>
>- Once all the function calls (```fs.readFile``` and the ```4``` ```doHash``` function calls) are properly allocated to the first ```4``` threads in the **thread pool**.
>- When ```fs``` module call is loaded into thread ```1```, thread ```1``` started to go through the process of the ```fs.readFile``` method, where node goes out to get some information about the file, accesses the hard drive and returns the information, then node goes out and accesses the hard drive again to stream the file contents back to the application, where node returns the file contents to us.
>- During that first *phase* where ```thread 1``` goes out to the hard drive to get some information about the specified file, the *thread* will basically move on to the next transaction in line (```pbkdf2``` call number ```4```). So ```thread 1``` temporarily forgets about that file system call and starts calculating the hash.
>- ```thread 2``` will complete and be ready to accept more work, it will see that there's still a pending **file system** call that needs to be worked on. ```thread 2``` will look to see if it has gotten any information back from the hard drive. That information/statistics come back into ```thread 2``` and then continues to wrk on the **file system** call. Makes another follow up request to the hard drive to get the actual file contents. ```thread 2``` processes them and we then see that console log appear.
>- This is why we alway see one hash get completed before the file system module call.
>
>**Why do we always see the HTTP request complete first?**
>
>- *Note*, both the ```http``` request and the ```file system``` call are both **asynchronous**, it some amount of time for both of them to complete.
>- Node makes use of a **thread pool** for some very specific function calls. In particular, almost everything inside of the ```fs``` module makes use of this **thread pool**.
>- The crypto module function ```pbkdf2``` also makes use of the **thread pool** as well.
>-  However, the ```https``` module does not use the *thread pool*, instead it reaches out directly to the ```operating system``` and leverages the operating system to do all that networking work for us.
>- If we look at the times it took to complete the different operations, we see that the ```https``` call resolved right away, but we had to wait much longer for all the other function calls for some reason.
>

Performance
-------------
>*Improving Node Performance*
>- Use Node in ```Cluster Mode```.
>- Use ```Worker Threads```.
>
>*Note*:
>- It is **Recommended** to *Use Node in 'Cluster' Mode*, for improving performance of your application.
>- It is considered **Experimental** to *Use Worker Threads*.
>
>**Clustering**
>
>**Cluster Manager** is responsible for monitoring the health of individual instances of our application that we're going to launch at the same time on our computer. This is regarding multiple instances on ```one``` computer. The *cluster manager* itself doesn't actually execute any application code. The *cluster manager* isn't really responsible for handling incoming requests or fetching data from the database or doing anything like that. Instead, the *cluster manager* is responsible for monitoring the health of each of the individual instances.
>
>The *Cluster Manager* can:
>- Start instances.
>- Stop an instance.
>- Restart an instance.
>- Send an instance data.
>- Do other kind of administrative tasks.
>
>It is up to the individual instances of the server to actually process incoming requests and do things such as access the database, handle authentication, or serve up static files.
>
>**Worker Instances**
>
>*Worker Instances* are actually responsible for processing incoming requests.
>
>To create **worker instances** the *cluster manager* is going to require in the *cluster module* from the node *standard library*. There is one particular function on the **cluster module** called ```fork()``` and whenever we call that ```fork``` function from within the *cluster manager* node internally goes back to our index.js file and it executes it a second time, but it executes it that second time in a slightly different mode. Basically the index.js file is being executed multiple times by node. The very first time it's going to *produce* the **cluster manager** and then every time after that it's going to be producing our **worker instances**.
>
>**Use-case where Clustering in Node can be helpful?**
>
>If you have some routes inside of your app that usually take a while to process, but you have other routes that are very quick then by using *clustering* you can start up multiple instances of your server that more evenly address all the incoming *requests* that are coming into your application and have more predictable response times.
>
