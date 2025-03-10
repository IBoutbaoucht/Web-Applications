const { createApp } = Vue;

createApp({
    data() {
        return {
            pieces: [],
            search: "",
            selectedCategory: "",
            onlyAvailable: false,
            panier: []
        };
    },
    computed: {
        filteredPieces() {
            return this.pieces
                .filter(piece =>
                    piece.nom.toLowerCase().includes(this.search.toLowerCase())
                )
                .filter(piece =>
                    this.selectedCategory ? piece.categorie === this.selectedCategory : true
                )
                .filter(piece =>
                    this.onlyAvailable ? piece.disponible : true
                );
        },
        categories() {
            return [...new Set(this.pieces.map(piece => piece.categorie))];
        },
        total() {
            return this.panier.reduce((sum, item) => sum + item.prix, 0);
        }
    },
    methods: {
        fetchPieces() {
            fetch("pieces-autos.json")
                .then(response => response.json())
                .then(data => {
                    this.pieces = data.map(piece => ({
                        ...piece,
                        image: `images/${piece.id}.jpg`,
                        disponible: Math.random() > 0.3 
                    }));
                });


        },
        sortByPrice(order) {
            this.pieces.sort((a, b) => order === "asc" ? a.prix - b.prix : b.prix - a.prix);
        },
        addToCart(piece) {
            this.panier.push(piece);
        }
    },
    mounted() {
        this.fetchPieces();
    }
}).mount("#app");


