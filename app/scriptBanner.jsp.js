<script>
    // Inject banner HTML dynamically before loading the React app
    document.addEventListener("DOMContentLoaded", function() {
        var banner = document.createElement("div");
        banner.style.width = "100%";
        banner.style.backgroundColor = "#f0f0f0";
        banner.style.padding = "10px";
        banner.style.textAlign = "center";
        banner.innerHTML = "<h2>Welcome to MicroStrategy Library</h2><p>Your analytics platform just got better!</p>";
        document.body.insertBefore(banner, document.getElementById("react-root"));
    });
</script>