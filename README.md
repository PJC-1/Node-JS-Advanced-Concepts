
Advanced Node Concepts
===================
> Learning about Node.js

Threads
-------------
>*What are threads?*
>When ever you run **programs** on a computer, something called a **process* is started up.
>A **process** is an instance of a computer program that is being executed.
>Within a single process, we can have **multiple** things called **threads**.
>You can think of a **thread** as a type of **to-do list**, that has some number of instructions that need to be executed by the **cpu** of you computer.
>The **thread** is given to the **cpu**, and the **cpu** will attempt to **run** every instruction on it, **one by one**.
>A **single process** can have **multiple threads** inside of it.
>An important aspect of **threads** are **scheduling**, which refers to you **operating system's** ability to decide which **thread** to process at any given instance in time.
>You need to remember that your computer has a *limited* amount of resources available to it and your **cpu** can only process so many *instructions* per *second*.
>This starts to become very relevant when we start to get many active **processes** and **threads** on our computer.
>The **operating systems scheduler** has to look at the different **threads** that are asking to be processed, and figure out how to do some amount of work on each of them while making sure that they don't have to wait too long to be processed.
>We want to make sure that *urgent threads* don't have to wait too long to be executed.
>There are a couple different strategies that are used to improve the rate at which these threads can be processed.
>The first being: *Adding more CPU Cores to our machine.*, if we have more than one core inside of our  **CPU** then we can easily process multiple threads at the same time.
>The second is: *Closely examine the work that is being done by each thread and allow our operating system scheduler to detect big pauses in processing time due to expensive input and output operations*
>
