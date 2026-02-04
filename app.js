// ------------------ RecipeJS App (IIFE) ------------------
const RecipeApp = (() => {
    console.log("RecipeApp initializing...");

    // ------------------ Recipe Data ------------------
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "A creamy Italian pasta dish.",
            category: "pasta",
            ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black pepper"],
            steps: [
                "Boil pasta",
                "Cook pancetta",
                {
                    text: "Prepare sauce",
                    substeps: ["Beat eggs with parmesan", "Mix with pancetta"]
                },
                "Combine pasta with sauce",
                "Serve hot"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Tender chicken in spiced sauce.",
            category: "curry",
            ingredients: ["Chicken", "Yogurt", "Garam masala", "Tomato puree", "Cream"],
            steps: [
                "Marinate chicken",
                "Cook chicken in oven",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Sauté onions and garlic",
                        "Add tomato puree",
                        "Add cream and spices"
                    ]
                },
                "Combine chicken with sauce",
                "Garnish and serve"
            ]
        },
        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Buttery French pastries.",
            category: "baking",
            ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar", "Salt"],
            steps: [
                "Prepare dough",
                "Layer with butter",
                {
                    text: "Fold dough multiple times",
                    substeps: ["First fold", "Second fold", "Third fold"]
                },
                "Shape croissants",
                "Bake until golden"
            ]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables and feta.",
            category: "salad",
            ingredients: ["Tomatoes", "Cucumber", "Feta cheese", "Olives", "Olive oil"],
            steps: [
                "Chop vegetables",
                "Mix vegetables in a bowl",
                "Add feta and olives",
                "Drizzle olive oil",
                "Serve fresh"
            ]
        },
        {
            id: 5,
            title: "Beef Wellington",
            time: 120,
            difficulty: "hard",
            description: "Beef wrapped in pastry.",
            category: "meat",
            ingredients: ["Beef fillet", "Mushrooms", "Puff pastry", "Eggs", "Mustard"],
            steps: [
                "Sear beef fillet",
                "Prepare mushroom duxelles",
                "Wrap beef with pastry",
                "Bake in oven",
                "Rest and serve"
            ]
        },
        {
            id: 6,
            title: "Vegetable Stir Fry",
            time: 20,
            difficulty: "easy",
            description: "Quick mixed vegetables.",
            category: "vegetarian",
            ingredients: ["Broccoli", "Carrots", "Bell peppers", "Soy sauce", "Garlic"],
            steps: [
                "Chop vegetables",
                "Heat pan with oil",
                "Stir fry vegetables",
                "Add soy sauce and seasoning",
                "Serve hot"
            ]
        },
        {
            id: 7,
            title: "Pad Thai",
            time: 30,
            difficulty: "medium",
            description: "Thai noodles with sauce.",
            category: "noodles",
            ingredients: ["Rice noodles", "Tofu", "Eggs", "Tamarind paste", "Peanuts"],
            steps: [
                "Soak noodles",
                "Cook tofu and eggs",
                {
                    text: "Prepare sauce",
                    substeps: ["Mix tamarind paste", "Add fish sauce", "Add sugar"]
                },
                "Combine noodles with sauce",
                "Garnish with peanuts and lime"
            ]
        },
        {
            id: 8,
            title: "Margherita Pizza",
            time: 60,
            difficulty: "medium",
            description: "Classic pizza.",
            category: "pizza",
            ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
            steps: [
                "Prepare dough",
                "Spread tomato sauce",
                "Add mozzarella and basil",
                "Bake in oven",
                "Drizzle olive oil and serve"
            ]
        }
    ];

    // ------------------ DOM Elements ------------------
    const recipeContainer = document.querySelector("#recipe-container");
    const filterButtons = document.querySelectorAll(".filters button");
    const sortButtons = document.querySelectorAll(".sorts button");

    // ------------------ App State ------------------
    let currentFilter = "all";
    let currentSort = "none";

    // ------------------ Pure Functions ------------------
    const renderSteps = (steps, level = 0) => {
        let html = "<ol>";
        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li style="margin-left:${level * 20}px">${step}</li>`;
            } else {
                html += `<li style="margin-left:${level * 20}px">${step.text}`;
                html += renderSteps(step.substeps, level + 1);
                html += "</li>";
            }
        });
        html += "</ol>";
        return html;
    };

    const createRecipeCard = recipe => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <p>${recipe.time} min | ${recipe.difficulty}</p>
            <p>${recipe.description}</p>

            <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">
                Show Steps
            </button>
            <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">
                Show Ingredients
            </button>

            <div class="steps-container" data-recipe-id="${recipe.id}" style="display:none;">
                ${renderSteps(recipe.steps)}
            </div>

            <div class="ingredients-container" data-recipe-id="${recipe.id}" style="display:none;">
                <ul>
                    ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
                </ul>
            </div>
        </div>
    `;

    const filterRecipes = (recipes, filter) => {
        if (filter === "all") return recipes;
        if (filter === "quick") return recipes.filter(r => r.time <= 30);
        return recipes.filter(r => r.difficulty === filter);
    };

    const sortRecipes = (recipes, sortType) => {
        if (sortType === "name") return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
        if (sortType === "time") return [...recipes].sort((a, b) => a.time - b.time);
        return recipes;
    };

    const renderRecipes = recipesToRender => {
        recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join("");
    };

    const updateDisplay = () => {
        const filtered = filterRecipes(recipes, currentFilter);
        const sorted = sortRecipes(filtered, currentSort);
        renderRecipes(sorted);
    };

    // ------------------ Event Handling ------------------
    recipeContainer.addEventListener("click", e => {
        if (!e.target.classList.contains("toggle-btn")) return;

        const { recipeId, toggle } = e.target.dataset;
        const container = document.querySelector(
            `.${toggle}-container[data-recipe-id="${recipeId}"]`
        );

        const isVisible = container.style.display === "block";
        container.style.display = isVisible ? "none" : "block";
        e.target.textContent = `${isVisible ? "Show" : "Hide"} ${toggle === "steps" ? "Steps" : "Ingredients"}`;
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            updateDisplay();
        });
    });

    sortButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sortButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentSort = btn.dataset.sort;
            updateDisplay();
        });
    });

    // ------------------ Initialize App ------------------
    const init = () => {
        console.log("RecipeApp ready!");
        updateDisplay();
    };

    return { init };
})();

// Initialize the Recipe App
RecipeApp.init();
