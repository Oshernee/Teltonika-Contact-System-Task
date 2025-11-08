# Teltonika Contact System Task

## 📌 Project Overview

Hey there! This is a contact management web application I built as part of an internship task for Teltonika. Think of it as a simple but functional contact book where you can store and manage all your important contacts in one place.

The app lets you do everything you'd expect from a contact manager: add new contacts with their details, browse through your entire contact list, update information when someone changes their phone number or email, and remove contacts you no longer need. It's straightforward, clean, and gets the job done.

What makes this project interesting is the tech stack. Instead of building a traditional backend from scratch, I used **PocketBase** — a neat little backend-as-a-service that gives you a database, REST API, and admin panel right out of the box. On the frontend, I went with **Vue 3** and **Vite** for a modern, snappy user experience. The whole thing is styled with **Tailwind CSS** to keep the UI clean and responsive.

This was a great learning experience in building a full-stack application with modern tools while keeping things lightweight and maintainable.

---

## 🛠️ Tech Stack

Here's what powers this application:

- **Vue 3** – A progressive JavaScript framework for building user interfaces. Vue makes it easy to create reactive, component-based UIs that are a joy to work with.

- **Vite** – Lightning-fast build tool and dev server. Seriously, the hot module replacement is so quick you'll barely notice you made changes before they appear in your browser.

- **PocketBase** – This is the star of the backend. It's an open-source backend that combines a real-time database, authentication, file storage, and a REST API into a single executable file. No complex server setup needed!

- **Tailwind CSS** – Utility-first CSS framework that lets you style components directly in your markup. Makes it super easy to create responsive designs without writing custom CSS.

- **Vue Router** – For handling navigation between different views in the single-page application.

---

## ✅ Features

Here's what you can do with this contact management system:

### Core Functionality

- **Add New Contacts** – Use a simple form to create new contact entries. Fill in their name, email, phone number, and optionally their position or job title. The form validates your input to make sure you're not submitting incomplete or invalid data.

- **View All Contacts** – See all your contacts displayed in a clean, scrollable list. Each contact card shows their essential information at a glance, making it easy to find who you're looking for.

- **Edit Contact Information** – Need to update someone's details? Just click on a contact to open the edit view where you can modify any field. Changes are saved instantly to the database.

- **Delete Contacts** – Remove contacts you no longer need with a simple delete action. Don't worry, there's confirmation to prevent accidental deletions.

### Technical Features

- **Form Validation** – Client-side validation ensures all required fields are filled and data formats (like email) are correct before anything gets saved to the database.

- **Fully Responsive Design** – The interface adapts beautifully whether you're on a desktop monitor, tablet, or smartphone. Tailwind's responsive utilities make this happen seamlessly.

- **Single Page Application (SPA)** – Uses Vue Router for smooth, instant navigation between views. No page reloads, no flickering — just a fluid user experience.

- **PocketBase Integration** – All CRUD operations (Create, Read, Update, Delete) are handled through PocketBase's JavaScript SDK. Data persistence is handled automatically.

- **Component-Based Architecture** – The app is built with reusable Vue components (contact cards, forms, buttons, etc.) making the code maintainable and easy to extend.

- **Real-Time Ready** – While not implemented in this version, the foundation is there to add real-time updates using PocketBase's real-time subscriptions. Imagine seeing contact changes live as they happen!

---

## 📁 Project Structure

Here's how the project is organized:

```
Teltonika-Contact-System-Task/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ContactCard.vue  # Individual contact display
│   │   ├── ContactForm.vue  # Form for adding/editing
│   │   └── ...
│   ├── views/               # Page-level components
│   │   ├── ContactList.vue  # Main list view
│   │   ├── AddContact.vue   # Add new contact page
│   │   ├── EditContact.vue  # Edit existing contact
│   │   └── ...
│   ├── services/            # API and service layer
│   │   └── pocketbaseService.js  # PocketBase client setup
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   ├── App.vue              # Root application component
│   └── main.js              # Application entry point
├── public/                  # Static assets (favicon, etc.)
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # You are here!
```

---

## ⚙️ Setup Instructions

Getting this project running on your machine is straightforward. Just follow these steps:

### Prerequisites

Before you start, make sure you have:
- **Node.js** (v16 or higher) installed on your machine
- **npm** or **yarn** package manager
- Basic familiarity with the command line

### 1. Setting Up the Backend (PocketBase)

PocketBase will handle all our data storage and API needs. Here's how to get it running:

#### Step 1: Download PocketBase

Head over to [https://pocketbase.io/](https://pocketbase.io/) and download the appropriate version for your operating system (Windows, macOS, or Linux). PocketBase is just a single executable file — no complicated installation process!

#### Step 2: Run PocketBase

Extract the downloaded file to a folder, open your terminal in that directory, and run:

```bash
./pocketbase serve
```

On Windows, use:
```bash
pocketbase.exe serve
```

You should see output indicating that PocketBase is running. By default, it starts on port 8090.

#### Step 3: Access the Admin Panel

Open your browser and navigate to:
```
http://127.0.0.1:8090/_/
```

The first time you visit, you'll be prompted to create an admin account. Go ahead and set up your credentials — you'll need these to manage your database.

#### Step 4: Create the Contacts Collection

Once you're logged into the admin panel:

1. Click on **"Collections"** in the sidebar
2. Click **"Create collection"**
3. Name it **`contacts`** (this is important — the frontend expects this exact name)
4. Add the following fields:

   | Field Name | Field Type | Options |
   |------------|------------|---------|
   | `name` | Text | Required |
   | `email` | Email | Required |
   | `phone` | Text | Required |
   | `position` | Text | Optional |

5. **Important:** In the collection settings, go to the **"API Rules"** tab and set appropriate permissions. For development/testing, you can allow public read/write access, but remember to restrict this in production!

6. Save your collection

Your backend is now ready! PocketBase will automatically create a REST API for this collection.

### 2. Setting Up the Frontend (Vue App)

Now let's get the Vue application running:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Oshernee/Teltonika-Contact-System-Task.git
cd Teltonika-Contact-System-Task
```

#### Step 2: Install Dependencies

Install all the required npm packages:

```bash
npm install
```

This might take a minute or two depending on your internet connection. Go grab a coffee! ☕

#### Step 3: Configure PocketBase Connection

Open the file `src/services/pocketbaseService.js` and make sure the PocketBase URL matches where your PocketBase instance is running:

```javascript
const pb = new PocketBase('http://127.0.0.1:8090');
```

If you changed PocketBase's port or are running it on a different machine, update this URL accordingly.

#### Step 4: Start the Development Server

Fire up the Vite dev server:

```bash
npm run dev
```

You should see output showing that the dev server is running. Open your browser and go to:
```
http://localhost:5173
```

🎉 **That's it!** Your contact management system should now be up and running!

---

## 🚀 Building for Production

When you're ready to deploy this app, you can create an optimized production build:

```bash
npm run build
```

This will generate a `dist` folder with optimized, minified files ready to deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

For PocketBase, you can run it on any VPS or server. Just make sure to:
- Update the PocketBase URL in your frontend to point to your production server
- Set proper API rules to restrict access appropriately
- Set up authentication if needed for production use

---

## 💡 Notes and Tips

### Development Tips

- **Hot Module Replacement (HMR)** is enabled by default with Vite, so your changes appear instantly without losing application state.

- The **PocketBase Admin UI** at `http://127.0.0.1:8090/_/` is your friend. Use it to inspect data, test API rules, and debug issues.

- Check the browser's **developer console** for any errors or warnings. Vue's error messages are usually quite helpful.

### Known Limitations

- **No Authentication**: This is a simple CRUD app without user authentication. Anyone who accesses the app can see and modify all contacts. In a real-world application, you'd want to add user accounts and permissions.

---

## 🐛 Troubleshooting

### "Cannot connect to PocketBase"

- Make sure PocketBase is actually running (`./pocketbase serve`)
- Check that the URL in `pocketbaseService.js` matches your PocketBase instance
- Verify there are no firewall issues blocking port 8090

### "Collection not found" error

- Make sure you created a collection named exactly `contacts` (lowercase)
- Check that the collection has the correct fields

### Changes not appearing in the UI

- Check the browser console for errors
- Verify the PocketBase admin UI shows the data correctly
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Styling looks broken

- Make sure all npm packages installed correctly (`npm install`)
- Check that `tailwind.config.js` exists and is properly configured

---

## 📚 Learn More

Want to dive deeper into the technologies used?

- **Vue 3 Documentation**: [https://vuejs.org/](https://vuejs.org/)
- **Vite Guide**: [https://vitejs.dev/](https://vitejs.dev/)
- **PocketBase Documentation**: [https://pocketbase.io/docs/](https://pocketbase.io/docs/)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)

---

## 🙌 Acknowledgments

Thanks for checking out this project! This was created as an internship task for Teltonika to demonstrate full-stack development skills using modern JavaScript frameworks and tools.

The project showcases:
- Component-based UI development with Vue 3
- RESTful API integration
- State management and routing
- Responsive design principles
- Modern development tooling (Vite, Tailwind)