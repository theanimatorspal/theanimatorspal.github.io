import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, Any, List
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent.parent
NAV_XML = ROOT_DIR / "content" / "navigation.xml"
LESSONS_DIR = ROOT_DIR / "content" / "lessons"

app = FastAPI(title="KSAI Platform")
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

def load_site_navigation() -> Dict[str, Any]:
    tree = ET.parse(NAV_XML)
    root = tree.getroot()

    platform = {
        "name": root.findtext("platform/name", "KSAI"),
        "tagline": root.findtext("platform/tagline", "Arts, Technology & Philosophy"),
        "price": root.findtext("platform/price", "$5/mo")
    }

    pills = []
    for p in root.findall("pills/pill"):
        pills.append({
            "label": p.get("label", ""),
            "url": p.get("url", ""),
            "badge": p.get("badge", ""),
            "active": p.get("active") == "true"
        })

    sub_menu = []
    for item in root.findall("sub_menu/item"):
        dropdown = []
        for d in item.findall("dropdown"):
            dropdown.append({
                "title": d.get("title", ""),
                "url": d.get("url", "")
            })
        sub_menu.append({
            "label": item.get("label", ""),
            "url": item.get("url", ""),
            "badge": item.get("badge", ""),
            "is_highlight": item.get("highlight") == "true",
            "dropdown": dropdown if dropdown else None
        })

    hero_elem = root.find("hero")
    tiers = []
    if hero_elem is not None:
        for t in hero_elem.findall("tiers/tier"):
            tiers.append({
                "name": t.get("name", ""),
                "desc": t.get("desc", ""),
                "price": t.get("price", "")
            })

    hero = {
        "headline": hero_elem.findtext("headline", "") if hero_elem is not None else "",
        "subheadline": hero_elem.findtext("subheadline", "") if hero_elem is not None else "",
        "card_tag": hero_elem.findtext("card_tag", "") if hero_elem is not None else "",
        "stat_number": hero_elem.findtext("stat_number", "") if hero_elem is not None else "",
        "stat_label": hero_elem.findtext("stat_label", "") if hero_elem is not None else "",
        "highlight_title": hero_elem.findtext("highlight_title", "") if hero_elem is not None else "",
        "tiers": tiers
    }

    pillars = []
    for pill in root.findall("pillars/pillar"):
        pillars.append({
            "id": pill.get("id", ""),
            "tag": pill.get("tag", ""),
            "badge_bg": pill.get("badge_bg", "#FEF3C7"),
            "badge_color": pill.get("badge_color", "#D97706"),
            "title": pill.findtext("title", ""),
            "desc": pill.findtext("desc", ""),
            "url": pill.findtext("url", ""),
            "link_text": pill.findtext("link_text", "")
        })

    return {
        "platform": platform,
        "pills": pills,
        "sub_menu": sub_menu,
        "hero": hero,
        "pillars": pillars
    }

def load_all_lessons() -> List[Dict[str, Any]]:
    lessons = []
    if not LESSONS_DIR.exists():
        return lessons
    for p in LESSONS_DIR.glob("*.xml"):
        try:
            tree = ET.parse(p)
            root = tree.getroot()
            meta = root.find("meta")
            body = root.findtext("body", "")
            if meta is not None:
                lessons.append({
                    "slug": meta.findtext("slug", p.stem),
                    "title": meta.findtext("title", "Untitled"),
                    "domain": meta.findtext("domain", "General"),
                    "type": meta.findtext("type", "Lesson"),
                    "access": meta.findtext("access", "Public"),
                    "description": meta.findtext("description", ""),
                    "badge": meta.findtext("badge", ""),
                    "badge_bg": meta.findtext("badge_bg", "#FEF3C7"),
                    "badge_color": meta.findtext("badge_color", "#92400E"),
                    "body": body
                })
        except Exception:
            continue
    return lessons

def base_context(request: Request, current_page: str, nav: Dict[str, Any], active_domain: str = ""):
    return {
        "request": request,
        "current_page": current_page,
        "active_domain": active_domain,
        "platform": nav["platform"],
        "pill_nav": nav["pills"],
        "sub_menu": nav["sub_menu"],
    }

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    nav = load_site_navigation()
    lessons = load_all_lessons()
    ctx = base_context(request, "home", nav)
    ctx.update({
        "hero": nav["hero"],
        "pillars": nav["pillars"],
        "content_items": lessons[:3]
    })
    return templates.TemplateResponse(request=request, name="pages/home.html", context=ctx)

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, plan: str = "beginner"):
    nav = load_site_navigation()
    ctx = base_context(request, "dashboard", nav)
    ctx.update({"selected_plan": plan})
    return templates.TemplateResponse(request=request, name="pages/dashboard.html", context=ctx)

@app.get("/catalog", response_class=HTMLResponse)
async def catalog(request: Request, q: str = "", domain: str = "", type: str = ""):
    nav = load_site_navigation()
    items = load_all_lessons()
    if q:
        items = [i for i in items if q.lower() in i["title"].lower() or q.lower() in i["description"].lower()]
    if domain:
        items = [i for i in items if i["domain"].lower() == domain.lower()]
    if type:
        items = [i for i in items if type.lower() in i["type"].lower()]
    ctx = base_context(request, "catalog", nav, active_domain=domain)
    ctx.update({"items": items, "search_q": q})
    return templates.TemplateResponse(request=request, name="pages/catalog.html", context=ctx)

@app.get("/content/{slug}", response_class=HTMLResponse)
async def content_detail(request: Request, slug: str):
    nav = load_site_navigation()
    items = load_all_lessons()
    item = next((i for i in items if i["slug"] == slug), None)
    if not item:
        item = {
            "slug": slug,
            "title": f"Module: {slug.replace('-', ' ').title()}",
            "domain": "Interdisciplinary",
            "type": "Lesson",
            "access": "Public",
            "description": "Module overview notes.",
            "body": "<p>Content being formatted.</p>"
        }
    ctx = base_context(request, "catalog", nav, active_domain=item.get("domain", ""))
    ctx.update({"item": item})
    return templates.TemplateResponse(request=request, name="pages/article.html", context=ctx)

@app.get("/membership", response_class=HTMLResponse)
async def membership(request: Request):
    nav = load_site_navigation()
    ctx = base_context(request, "membership", nav)
    return templates.TemplateResponse(request=request, name="pages/membership.html", context=ctx)

@app.get("/tools", response_class=HTMLResponse)
async def tools(request: Request):
    nav = load_site_navigation()
    items = load_all_lessons()
    interactive = [i for i in items if "Interactive" in i["type"] or "Problem" in i["type"]]
    ctx = base_context(request, "tools", nav)
    ctx.update({"items": interactive})
    return templates.TemplateResponse(request=request, name="pages/catalog.html", context=ctx)

def main():
    import uvicorn
    uvicorn.run("theanimatorspal_github_io.main:app", host="127.0.0.1", port=8000, reload=True)
