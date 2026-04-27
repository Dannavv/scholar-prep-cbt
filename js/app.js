document.addEventListener('DOMContentLoaded', () => {
    HPCLCommon.setupMouseMotion();
    HPCLCommon.setupSidebarToggle();
    window.HPCLLearn?.initLearnPage();
    window.HPCLExam?.initExamPage();
    window.HPCLAnalyze?.initAnalyzePage();
});
