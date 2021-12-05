# Screen capture

An example to show how easy it is to write an Electron app.

This was part of a tutorial on how to write an Electron app in 10 minutes:

[Electron 10 Minute Project](https://fireship.io/lessons/electron-screen-recorder-project-tutorial/)

and the code was copied from:

[screen-recorder source code](https://github.com/brainey/electron-screen-recorder)

Unfortunately, since the time this tutorial was written, several  changes have
been made to Electron to make it a more secure environment. One of the changes
was the removal of the `remote` from the renderer process. So, had to the
portions using remote using ipcMain and ipcRenderer. It does seem odd to me
that things like dialog and popup windows are not a renderer process, but they
are part of the main process space (as coded up in `index.js`).

Anyway, I wanted to capture this (sorry for the pun...) before moving on
to learning other capabilities and features of Electron.
