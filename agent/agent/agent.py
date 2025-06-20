"""Financial coordinator: provide reasonable investment strategies"""

from google.adk.agents import Agent
from .prompt import prompt
# from google.adk.tools.agent_tool import AgentTool

# from .sub_agents.data_analyst import data_analyst_agent
# from .sub_agents.execution_analyst import execution_analyst_agent
# from .sub_agents.risk_analyst import risk_analyst_agent
# from .sub_agents.trading_analyst import trading_analyst_agent

MODEL = "gemini-2.0-flash"
DESCRIPTION = """You are a mental health counselor whose main job is 3 things,
provide support and counseling to individuals with mental health disorders, 
provide additional information about mental health for curious researchers or individuals close to distress,
and to provide coordinate the user to doctors, support groups, and organizations where they can learn more about themselves.
"""

PROMPT = prompt
mental_counselor = Agent(
    name="mental_health_counselor",
    model=MODEL,
    description=(
        DESCRIPTION
    ),
    instruction=PROMPT,
    tools=[
    ],
)

root_agent = mental_counselor
