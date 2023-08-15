# Hacker News Template

Make your own Hacker News like website on any topic (ex: History, biology, etc...) you want by using this template as a base.
bkgdghdhdhd

## Assigning Admin Perms
You may find that you would like to be able to delete posts, especially while testing your Hacker News-like website. The easiest way to do this is to create an account and give it admin.

This can be done by adding an Environment Variable (lock icon on left-hand side of Replit editor) with a key of `ADD_ADMIN` and a value of your account's username. When you run the repl, the program will read this variable and assign admin to that account. Once you run it, be sure to remove the Environment Variable afterwards.

Once your account has admin on the website, you will be able to delete posts and comments using the "x" button that appears next to each of them.

Should you ever need to remove admin from an account, you can follow the same process except by using the `REMOVE_ADMIN` Environment Variable instead of the previously mentioned `ADD_ADMIN`.
