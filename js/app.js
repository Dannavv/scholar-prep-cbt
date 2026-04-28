document.addEventListener('DOMContentLoaded', () => {
    HPCLCommon.setupMouseMotion();
    HPCLCommon.setupSidebarToggle();
    window.HPCLLearn?.initLearnPage();
    window.HPCLPaper2Learn?.initLearnPage();
    window.HPCLExam?.initExamPage();
    window.HPCLAnalyze?.initAnalyzePage();
});
