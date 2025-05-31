const btnGroup = document.querySelector(".btn-group");
const botoesVerde = document.getElementById("botoesVerde"); // Corrigido para getElementById

if (btnGroup) {
    btnGroup.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
            const selectedButton = e.target;
            const buttons = btnGroup.querySelectorAll("button");
            buttons.forEach((button) => {
                button.classList.remove('active');
            });
            selectedButton.classList.add("active");
        }
    });
}

if (botoesVerde) {
    botoesVerde.querySelectorAll(".flex.items-center.space-x-4").forEach(card => {
        card.addEventListener("click", function () {
            document.querySelector(".content-wrapper").style.display = "none";

            let novaTela = document.getElementById("nova-tela-consulta");
            if (!novaTela) {
                novaTela = document.createElement("div");
                novaTela.id = "nova-tela-consulta";
                novaTela.style.position = "fixed";
                novaTela.style.top = "0";
                novaTela.style.left = "0";
                novaTela.style.width = "100vw";
                novaTela.style.height = "100vh";
                novaTela.style.background = "rgba(255,255,255,0.98)";
                novaTela.style.zIndex = "9999";
                novaTela.style.overflowY = "auto";
                novaTela.innerHTML = `
                    <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
                        <h2 class="text-[#00b386] text-lg font-semibold mb-4">Consultas</h2>
                        <div class="bg-gray-200 rounded-lg p-6">
                          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
                            <div class="bg-[#00b386] rounded-lg p-6 w-full sm:w-[360px] mb-6 sm:mb-0">
                              <div class="flex items-center mb-3 justify-center">
                                <button aria-label="Back" class="text-black text-2xl font-semibold mr-3" id="voltar-btn">
                                  <i data-feather="arrow-left"></i>
                                </button>
                                <h3 class="text-black text-base font-semibold flex-1 text-center">
                                  Consultas Previstas
                                </h3>
                              </div>
                              <div class="flex items-start space-x-4 justify-center">
                                <div class="w-10 h-10 rounded-full bg-black mt-1" aria-hidden="true"></div>
                                <div class="text-black text-sm leading-6 space-y-2">
                                  <p>zeca</p>
                                  <p>contato</p>
                                  <p>email</p>
                                  <p>caso de burnout/depressao</p>
                                  <p>1º Sessão</p>
                                </div>
                              </div>
                            </div>
                            <div class="flex flex-col space-y-6 w-full sm:w-auto items-center">
                              <div class="flex justify-center items-center text-sm text-black font-semibold mb-2 w-full">
                                <span>Data Consulta</span>
                              </div>
                              <div class="text-sm text-black mb-6 text-center w-full">
                                Hoje - 15:00hrs
                              </div>
                              <button type="button" class="bg-[#00b386] text-white text-sm font-semibold px-4 py-2 rounded flex items-center space-x-3 w-max self-center">
                                <i data-feather="file-text"></i>
                                <span>ANAMNESES</span>
                              </button>
                              <div class="text-sm text-black font-semibold mb-2 w-full text-center">Foi Consultado ?</div>
                              <div class="flex space-x-6 pr-0 justify-center w-full">
                                <button type="button" aria-label="Não Consultado" class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                                  <i data-feather="x"></i>
                                </button>
                                <button type="button" aria-label="Consultado" class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center ml-6 pr-0">
                                  <i data-feather="check-circle"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="flex justify-between mt-8 space-x-6">
                          <button
                            type="button"
                            class="bg-[#00b386] text-white text-sm font-semibold rounded px-4 py-2 flex items-center space-x-3 max-w-[220px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
                            style="box-shadow: 0 0 0 1px rgba(0,0,0,0.1);"
                          >
                            <i data-feather="file-text"></i>
                            <span>Registrar Relatório</span>
                          </button>
                          <button
                            type="button"
                            class="bg-black text-white text-sm font-semibold rounded px-4 py-2 flex items-center space-x-3 max-w-[180px]"
                          >
                            <i data-feather="plus"></i>
                            <span>Agendar Retorno</span>
                          </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(novaTela);

                // Renderiza os ícones Feather
                if (window.feather) feather.replace();

                novaTela.querySelector("#voltar-btn").addEventListener("click", function() {
                    novaTela.style.display = "none";
                    document.querySelector(".content-wrapper").style.display = "block";
                });
            }
            novaTela.style.display = "block";
            // Renderiza os ícones Feather novamente caso a tela já exista
            if (window.feather) feather.replace();
        });
    });
}
