pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

class CannonMagazineViewer {
  constructor(root) {
    this.root = root;
    this.pdfUrl = root.dataset.pdfUrl || "";
    this.docTitle = root.dataset.title || "Magazine";
    this.canvas = root.querySelector("[data-canvas]");
    this.sheet = root.querySelector("[data-sheet]");
    this.loader = root.querySelector("[data-loader]");
    this.currentPageEl = root.querySelector("[data-current-page]");
    this.totalPagesEl = root.querySelector("[data-total-pages]");
    this.docTitleEl = root.querySelector("[data-doc-title]");
    this.downloadLink = root.querySelector("[data-download-link]");

    this.ctx = this.canvas.getContext("2d", { alpha: false });

    this.pdfDoc = null;
    this.pageNum = 1;
    this.scale = 1;
    this.baseScale = 1;
    this.renderTask = null;
    this.isRendering = false;
    this.pendingPage = null;
    this.isAnimating = false;

    this.handleResize = this.handleResize.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  async init() {
    if (!this.pdfUrl) {
      this.showError("Missing PDF URL.");
      return;
    }

    this.docTitleEl.textContent = this.docTitle;
    this.downloadLink.href = this.pdfUrl;

    this.bindEvents();

    try {
      const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
      this.pdfDoc = await loadingTask.promise;
      this.totalPagesEl.textContent = this.pdfDoc.numPages;
      await this.renderPage(this.pageNum, false);
      this.hideLoader();
    } catch (error) {
      console.error(error);
      this.showError("Unable to load PDF.");
    }
  }

  bindEvents() {
    this.root.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "next") this.nextPage();
        if (action === "prev") this.prevPage();
        if (action === "zoom-in") this.zoomIn();
        if (action === "zoom-out") this.zoomOut();
      });
    });

    window.addEventListener("resize", this.handleResize);
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(event) {
    if (!this.root.isConnected) return;
    if (event.key === "ArrowRight") this.nextPage();
    if (event.key === "ArrowLeft") this.prevPage();
  }

  async handleResize() {
    if (!this.pdfDoc) return;
    await this.renderPage(this.pageNum, false);
  }

  async renderPage(pageNumber, animateDirection) {
    if (!this.pdfDoc) return;

    if (this.isRendering) {
      this.pendingPage = { pageNumber, animateDirection };
      return;
    }

    this.isRendering = true;
    this.showLoader();

    try {
      const page = await this.pdfDoc.getPage(pageNumber);
      const unscaledViewport = page.getViewport({ scale: 1 });

      const stage = this.root.querySelector(".cm-mag-stage");
      const stageWidth = Math.min(stage.clientWidth - 24, 980);

      this.baseScale = stageWidth / unscaledViewport.width;
      const finalScale = this.baseScale * this.scale;
      const viewport = page.getViewport({ scale: finalScale });

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.floor(viewport.width * dpr);
      this.canvas.height = Math.floor(viewport.height * dpr);
      this.canvas.style.width = viewport.width + "px";
      this.canvas.style.height = viewport.height + "px";

      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.clearRect(0, 0, viewport.width, viewport.height);

      if (animateDirection) {
        await this.playTurnAnimation(animateDirection);
      }

      if (this.renderTask) {
        try {
          this.renderTask.cancel();
        } catch (e) {}
      }

      this.renderTask = page.render({
        canvasContext: this.ctx,
        viewport: viewport
      });

      await this.renderTask.promise;

      this.pageNum = pageNumber;
      this.currentPageEl.textContent = this.pageNum;
      this.hideLoader();
    } catch (error) {
      if (error && error.name !== "RenderingCancelledException") {
        console.error(error);
        this.showError("Could not render page.");
      }
    } finally {
      this.isRendering = false;

      if (this.pendingPage) {
        const next = this.pendingPage;
        this.pendingPage = null;
        this.renderPage(next.pageNumber, next.animateDirection);
      }
    }
  }

  async playTurnAnimation(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.sheet.classList.remove("is-turn-next", "is-turn-prev");
    void this.sheet.offsetWidth;

    if (direction === "next") {
      this.sheet.classList.add("is-turn-next");
    } else if (direction === "prev") {
      this.sheet.classList.add("is-turn-prev");
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    this.sheet.classList.remove("is-turn-next", "is-turn-prev");
    this.isAnimating = false;
  }

  nextPage() {
    if (!this.pdfDoc || this.pageNum >= this.pdfDoc.numPages) return;
    this.renderPage(this.pageNum + 1, "next");
  }

  prevPage() {
    if (!this.pdfDoc || this.pageNum <= 1) return;
    this.renderPage(this.pageNum - 1, "prev");
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.15, 2.25);
    this.renderPage(this.pageNum, false);
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.15, 0.65);
    this.renderPage(this.pageNum, false);
  }

  showLoader() {
    this.loader.classList.remove("is-hidden");
  }

  hideLoader() {
    this.loader.classList.add("is-hidden");
  }

  showError(message) {
    this.loader.classList.remove("is-hidden");
    this.loader.innerHTML = '<div class="cm-mag-loader__text">' + message + "</div>";
  }
}

document.querySelectorAll(".cm-mag-viewer").forEach(function (viewer) {
  new CannonMagazineViewer(viewer).init();
});
