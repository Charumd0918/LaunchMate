import os
from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from database import ideas_collection, db
from gemini import (test_gemini, validate_idea, startup_health_score, generate_business_plan, 
                    generate_pitch, first_users_strategy, detect_risks, advanced_marketing_strategy, 
                    evaluate_daily_progress, chat_with_cofounder, generate_startup_analytics, generate_advanced_strategy, find_competitors, generate_logo_prompt, generate_pdf_blueprint,
                    generate_financial_hub)
from auth import router as auth_router, get_current_user
from models import UserOut
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router setup
api_router = APIRouter(prefix="/api")

# Database collections for caching
progress_collection = db["progress_logs"]
kanban_collection = db["kanban_boards"]
analysis_cache = db["analysis_cache"]

# Mount Authentication router
api_router.include_router(auth_router, prefix="/auth")

@app.get("/")
def home():
    return {"message": "LaunchMate backend is running"}

@api_router.get("/test-gemini")
def gemini_test(current_user: UserOut = Depends(get_current_user)):
    return {"response": test_gemini()}

@api_router.get("/validate")
def validate(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        # Check cache first with Sovereign Validation
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "validate"})
        if cached and "demandLevel" in cached.get("result", {}):
            return {"result": cached["result"], "message": "Loaded from cache", "cached": True}

        result = validate_idea(idea)

        # Store in cache
        analysis_cache.update_one(
            {"user_id": current_user.id, "idea": idea, "type": "validate"},
            {"$set": {"result": result}},
            upsert=True
        )

        # Also store in main ideas list if it doesn't exist
        ideas_collection.update_one(
            {"user_id": current_user.id, "idea": idea},
            {"$set": {
                "demand": result.get("demand", "Not found"),
                "competition": result.get("competition", "Not found"),
                "improvements": result.get("improvements", []),
                "score": result.get("score", "Not found"),
                "radar_scores": result.get("radar_scores", {}),
                "experts": result.get("experts", {})
            }},
            upsert=True
        )

        return {
            "result": result,
            "message": "Idea saved successfully",
            "cached": False
        }

    except Exception as e:
        return {"error": str(e)}

@api_router.get("/ideas")
def get_all_ideas(current_user: UserOut = Depends(get_current_user)):
    try:
        cursor = ideas_collection.find(
            {"user_id": current_user.id, "demand": {"$exists": True}},
            sort=[("_id", -1)]
        )
        ideas = []
        for idea in cursor:
            idea["_id"] = str(idea["_id"])
            ideas.append(idea)
        return {"success": True, "data": ideas}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.delete("/ideas/{idea_id}")
def delete_idea(idea_id: str, current_user: UserOut = Depends(get_current_user)):
    from bson.objectid import ObjectId
    try:
        result = ideas_collection.delete_one({"_id": ObjectId(idea_id), "user_id": current_user.id})
        if result.deleted_count > 0:
            return {"success": True, "message": "Idea deleted successfully"}
        return {"success": False, "message": "Idea not found or unauthorized"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.delete("/ideas")
def delete_all_ideas(current_user: UserOut = Depends(get_current_user)):
    try:
        # DEEP PURGE: Clear all user-associated data
        q = {"user_id": current_user.id}
        ideas_collection.delete_many(q)
        analysis_cache.delete_many(q)
        kanban_collection.delete_many(q)
        progress_collection.delete_many(q)
        
        return {"success": True, "message": "All startup architectures purged successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/ideas/latest")
def get_latest_idea(current_user: UserOut = Depends(get_current_user)):
    try:
        latest = ideas_collection.find_one(
            {"user_id": current_user.id, "demand": {"$exists": True}},
            sort=[("_id", -1)]
        )
        if latest:
            latest["_id"] = str(latest["_id"])
            return {"success": True, "data": latest}
        return {"success": False, "message": "No ideas found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/pitch")
def pitch_deck(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "pitch"})
        if cached and "narrative_script" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = generate_pitch(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "pitch"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/risk-detector")
def risk_detector(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "risk"})
        if cached and "overallThreatLevel" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = detect_risks(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "risk"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/marketing")
def marketing_strategy(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "marketing"})
        if cached and "first_100_action_plan" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = advanced_marketing_strategy(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "marketing"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/financial-hub")
def financial_hub(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "financial_hub"})
        if cached and "initial_cost" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = generate_financial_hub(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "financial_hub"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/analytics")
def analytics_projections(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "analytics"})
        if cached and "startupCost" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = generate_startup_analytics(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "analytics"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/competitors")
def competitors(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "competitors"})
        if cached and "marketStatus" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = find_competitors(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "competitors"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/logo-prompt")
def logo_prompt(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        result = generate_logo_prompt(idea)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/execution-board")
def execution_board(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        # Check if there's a saved board (with completion states)
        saved = kanban_collection.find_one({"user_id": current_user.id, "idea": idea, "type": "execution_blitz"})
        if saved:
            return {"success": True, "data": saved["board"], "saved": True}

        # Otherwise generate or load from general analysis cache
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "execution"})
        if cached: return {"success": True, "data": cached["result"], "cached": True}

        from gemini import generate_execution_board
        result = generate_execution_board(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "execution"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.post("/execution-board/save")
def save_execution_board(data: dict, current_user: UserOut = Depends(get_current_user)):
    try:
        idea = data.get("idea")
        new_board = data.get("board")
        
        # 1. Fetch previous board to detect changes
        old_record = kanban_collection.find_one({"user_id": current_user.id, "idea": idea, "type": "execution_blitz"})
        old_board = old_record.get("board", {}) if old_record else {}
        
        old_completed = old_board.get("completedTasks", {})
        new_completed = new_board.get("completedTasks", {})
        
        # 2. Detect newly completed tasks
        from datetime import datetime
        for key, was_done in new_completed.items():
            if was_done and not old_completed.get(key):
                # Task key is "dayIdx-taskIdx"
                try:
                    day_idx, task_idx = map(int, key.split("-"))
                    task_title = new_board["days"][day_idx]["tasks"][task_idx]["title"]
                    
                    # 3. Create Automated Momentum Trace
                    log_entry = {
                        "user_id": current_user.id,
                        "idea": idea,
                        "update_text": f"✓ TACTICAL VICTORY: {task_title} successfully executed.",
                        "status": "on_track",
                        "message": f"Operational momentum increased. The co-founder logic has verified the completion of this tactical objective.",
                        "milestones_achieved": [task_title],
                        "date": datetime.utcnow(),
                        "is_system_trace": True
                    }
                    progress_collection.insert_one(log_entry)
                except: pass
        
        # 4. Save the board state
        kanban_collection.update_one(
            {"user_id": current_user.id, "idea": idea, "type": "execution_blitz"},
            {"$set": {"board": new_board}},
            upsert=True
        )
        return {"success": True, "message": "Execution status and traces updated"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@api_router.get("/public/pitch/{idea_id}")
def get_public_pitch(idea_id: str):
    from bson.objectid import ObjectId
    try:
        # Fetch the idea to know the text
        idea_doc = ideas_collection.find_one({"_id": ObjectId(idea_id)})
        if not idea_doc:
            return {"success": False, "message": "Pitch not found or private"}
        
        # Directly generate or fetch pitch text (if stored, we can pull it, else generate it)
        # For simplicity, we just generate it live for public viewing
        result = generate_pitch(idea_doc["idea"])
        return {"success": True, "idea": idea_doc["idea"], "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/strategy")
def strategy_map(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        cached = analysis_cache.find_one({"user_id": current_user.id, "idea": idea, "type": "strategy"})
        if cached and "problemStatement" in cached.get("result", {}): 
            return {"success": True, "data": cached["result"], "cached": True}

        result = generate_advanced_strategy(idea)
        analysis_cache.update_one({"user_id": current_user.id, "idea": idea, "type": "strategy"}, {"$set": {"result": result}}, upsert=True)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

class ProgressInput(BaseModel):
    idea: str
    update_text: str

@api_router.post("/progress/check-in")
def progress_checkin(data: ProgressInput, current_user: UserOut = Depends(get_current_user)):
    try:
        result = evaluate_daily_progress(data.idea, data.update_text)
        
        from datetime import datetime
        log_entry = {
            "user_id": current_user.id,
            "idea": data.idea,
            "update_text": data.update_text,
            "status": result.get("status"),
            "message": result.get("message"),
            "milestones": result.get("milestones", []),
            "kpis": result.get("kpis", []),
            "checkpoints": result.get("checkpoints", []),
            "momentum_timeline": result.get("momentum_timeline", []),
            "date": datetime.utcnow()
        }

        progress_collection.insert_one(log_entry)
        
        # Return history alongside the new result
        history_cursor = progress_collection.find({"user_id": current_user.id}).sort("date", -1).limit(5)
        history = []
        for h in history_cursor:
            h["_id"] = str(h["_id"])
            history.append(h)
            
        return {"success": True, "data": result, "history": history}
    except Exception as e:
        return {"success": False, "error": str(e)}

class KanbanInput(BaseModel):
    idea: str
    columns: dict

@api_router.post("/kanban")
def save_kanban(data: KanbanInput, current_user: UserOut = Depends(get_current_user)):
    try:
        kanban_collection.update_one(
            {"user_id": current_user.id, "idea": data.idea},
            {"$set": {"columns": data.columns}},
            upsert=True
        )
        return {"success": True, "message": "Board saved"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/kanban")
def get_kanban(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        board = kanban_collection.find_one({"user_id": current_user.id, "idea": idea})
        if board:
            return {"success": True, "columns": board.get("columns", {})}
        return {"success": False, "message": "No board found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

class ChatInput(BaseModel):
    idea: str
    message: str
    history: list = []

@api_router.post("/chat")
def chat_endpoint(data: ChatInput, current_user: UserOut = Depends(get_current_user)):
    try:
        response = chat_with_cofounder(data.idea, data.history, data.message)
        return {"success": True, "reply": response}
    except Exception as e:
        return {"success": False, "error": str(e)}

@api_router.get("/health-score")
def health_score(idea: str, current_user: UserOut = Depends(get_current_user)):
    result = startup_health_score(idea)

    health_data = {
        "user_id": current_user.id,
        "idea": idea,
        "overall_score": result.get("overall_score", ""),
        "idea_strength": result.get("idea_strength", ""),
        "market_demand": result.get("market_demand", ""),
        "risk_level": result.get("risk_level", ""),
        "reason": result.get("reason", "")
    }

    ideas_collection.insert_one(health_data)

    return {
        "health_score": result,
        "message": "Health score saved successfully"
    }

@api_router.get("/business-plan")
def business_plan(idea: str, current_user: UserOut = Depends(get_current_user)):
    result = generate_business_plan(idea)

    plan_data = {
        "user_id": current_user.id,
        "idea": idea,
        "problem": result.get("problem", ""),
        "solution": result.get("solution", ""),
        "target_market": result.get("target_market", ""),
        "revenue_model": result.get("revenue_model", ""),
        "marketing_strategy": result.get("marketing_strategy", "")
    }

    ideas_collection.insert_one(plan_data)

    return {
        "business_plan": result,
        "message": "Business plan saved successfully"
    }
    

@api_router.get("/first-users")
def first_users(idea: str, current_user: UserOut = Depends(get_current_user)):
    result = first_users_strategy(idea)

    first_users_data = {
        "user_id": current_user.id,
        "idea": idea,
        "target_users": result.get("target_users", ""),
        "platforms": result.get("platforms", ""),
        "approach": result.get("approach", ""),
        "growth_plan": result.get("growth_plan", "")
    }

    ideas_collection.insert_one(first_users_data)

    return {
        "first_users_strategy": result,
        "message": "First users strategy saved successfully"
    }

@api_router.get("/blueprint")
def generate_blueprint(idea: str, current_user: UserOut = Depends(get_current_user)):
    try:
        # DEEP AGGREGATION: Consolidate all fragmented data entries
        master_context = {}
        
        # 1. Aggregate all findings from ideas_collection (Scores, Plans, Summaries)
        all_ideas = list(ideas_collection.find({"user_id": current_user.id, "idea": idea}))
        for doc in all_ideas:
            master_context.update(doc) # Merges overall_score, problem, solution, etc.

        # 2. Collect advanced modules from analysis_cache
        cached_items = analysis_cache.find({"user_id": current_user.id, "idea": idea})
        for item in list(cached_items):
            type_key = item["type"]
            master_context[type_key] = item.get("result", {})

        # 3. Fetch tactical board from kanban_collection
        saved_board = kanban_collection.find_one({"user_id": current_user.id, "idea": idea, "type": "execution_blitz"})
        if saved_board:
            master_context["execution"] = saved_board.get("board", {})
        
        try:
            # Attempt AI Deep Synthesis (High Fidelity)
            result = generate_pdf_blueprint(idea, context=master_context)
            return {"success": True, "data": result}
        except Exception as ai_err:
            print(f"AI Synthesis paused. Activating Fail-safe Assembly: {ai_err}")
            
            # PROFESSIONAL FAIL-SAFE ASSEMBLY (Structured JSON)
            result = {
                "cover": {
                    "title": "Startup Summary Report",
                    "idea_name": idea,
                    "summary": f"Targeted analysis for the '{idea}' concept."
                },
                "executive_summary": {
                    "problem": f"Identifying the primary problem solved by {idea}.",
                    "solution": f"Proposed technical/operational solution for {idea}.",
                    "target_audience": f"Initial target user group for {idea}.",
                    "unique_value": f"Key differentiator for {idea} in the current market."
                },
                "business_strategy": {
                    "revenue_streams": [f"Direct monetization of {idea}", f"Secondary income from {idea} features"],
                    "growth_strategy": [f"Niche marketing for {idea}", f"User acquisition for {idea}"],
                    "competitive_advantage": [f"Unique approach to {idea}", f"Efficiency of {idea}"]
                },
                "evaluation": {
                    "success_score": f"{master_context.get('overall_score', '85')}/100",
                    "market_demand": f"Analyzing market appetite for {idea}.",
                    "feasibility": f"Technical foundation of {idea}.",
                    "strengths": [f"Innovative {idea} model", "Scalable potential"],
                    "risks": [f"Early-stage {idea} adoption", f"Market competition for {idea}"]
                },
                "financial_plan": {
                    "initial_cost": master_context.get('initial_cost', 'Niche-dependent allocation'),
                    "monthly_expenses": f"Operational overhead for {idea}",
                    "pricing_model": f"Sustainable pricing for {idea}",
                    "break_even": f"Calculated timeline for {idea}"
                },
                "roadmap": [
                    { "step": "Phase 1", "action": f"Validate {idea} with 10 users" },
                    { "step": "Phase 2", "action": f"Build core {idea} prototype" },
                    { "step": "Phase 3", "action": f"Refine {idea} from feedback" },
                    { "step": "Phase 4", "action": f"Initial {idea} market launch" }
                ],
                "final_insight": {
                    "conclusion": f"The development path for {idea} is clear and actionable.",
                    "next_step": f"Conduct 5 stakeholder interviews for {idea} today."
                }
            }
            return {"success": True, "data": result, "mode": "fail-safe"}
            
    except Exception as e:
        return {"success": False, "error": f"Critical Report Failure: {str(e)}"}

# Include the main API router
app.include_router(api_router)