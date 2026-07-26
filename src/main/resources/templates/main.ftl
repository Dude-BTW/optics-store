<#import "templ/templ.ftl" as m>
<@m.pages>
    <style>
        .nav {
            background-image: linear-gradient(to bottom, #F3E275, #efd742, #FFE748, #FFE11A),
            linear-gradient(to top, #F3E275, #efd742, #FFE63B, #FFE11A),
            linear-gradient(to right, #F3E275, #efd742, #FFE63B, #FFE11A),
            linear-gradient(to left, #F3E275, #efd742, #FFE63B, #FFE11A);
            background-size: 100% 50%, 100% 50%, 50% 100%, 50% 100%;
            background-position: top left, bottom left, top right, bottom right;
            background-repeat: no-repeat;
        }

        ul {
            word-wrap: break-word;
        }
    </style>

    <ul class="nav flex-column rounded-3">
        <li class="nav-item">
            <a class="nav-link" href="/" class="btn btn-outline-danger">Main</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/admOptics" class="btn btn-outline-danger">Adm Optics</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/admClients" class="btn btn-outline-danger">Adm Client</a>
        </li>
    </ul>
</@m.pages>
